import { HTTP_STATUS } from '../constants/http.constants.js';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import { PROJECT_STATUS } from '../constants/project.constants.js';
import { AppError } from '../errors/AppError.js';
import { reviseProject } from '../utils/ai_services/ai.js';
import { applyOperations } from '../utils/ai_services/diff.js';

export class ChatService {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  #buildManifest(files) {
    return Object.entries(files || {}).map(([path, entry]) => ({
      path,
      hash: entry.hash,
      size: entry.content.length,
    }));
  }

  revise = async ({ prompt, projectId, userId }) => {
    const project = await this.projectRepository.startRevision({
      projectId,
      userId,
      prompt,
    });

    if (!project) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    try {
      const manifest = this.#buildManifest(project.files);
      console.log('manifest', manifest);

      const relevantFiles = {};
      for (const [path, entry] of Object.entries(project.files || {})) {
        relevantFiles[path] = entry.content;
      }

      console.log(
        `[AI] Revising project ${project.id}: "${prompt.slice(0, 80)}..." ` +
          `(${manifest.length} files, manifest ~${JSON.stringify(manifest).length} chars)`
      );

      const recentMessages = project.messages.slice(-4).map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const result = await reviseProject(
        prompt,
        manifest,
        relevantFiles,
        recentMessages
      );

      console.log(
        `[AI] Got ${result.operations.length} operations: ${result.description}`
      );

      const {
        files: updatedFiles,
        applied,
        errors,
      } = applyOperations(project.files, result.operations);

      if (errors.length > 0) {
        console.warn('[Diff] Errors applying operations:', errors);
      }

      const updatedProject = await this.projectRepository.saveRevision({
        projectId,
        userId,
        files: updatedFiles,
        message:
          result.description +
          (errors.length > 0
            ? `\n\nSome operations failed: ${errors.join(', ')}`
            : ''),
      });

      if (!updatedProject) {
        throw new AppError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.PROJECT_NOT_FOUND
        );
      }

      const filesObj = {};

      for (const [path, entry] of Object.entries(updatedProject.files || {})) {
        filesObj[path] = entry.content;
      }

      return {
        _id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
        files: filesObj,
        messages: updatedProject.messages,
        version: updatedProject.version,
        status: updatedProject.status,
        applied,
        errors,
        aiDescription: result.description,
      };
    } catch (error) {
      await this.projectRepository.setRevisionStatus({
        projectId,
        userId,
        status: PROJECT_STATUS.COMPLETED,
      });

      console.error(`[AI Revision Error] ${error.message}`);

      throw error;
    }
  };
}
