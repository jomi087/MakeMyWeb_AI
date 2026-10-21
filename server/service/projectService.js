import { HTTP_STATUS } from '../constants/http.constants.js';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import { PROJECT_STATUS } from '../constants/project.constants.js';
import { AppError } from '../errors/AppError.js';
import { generateProject } from '../utils/ai_services/ai.js';

export class ProjectService {
  /**
   * @param {import("../repositories/projectRepository.js").ProjectRepository} projectRepository
   */
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  #hashContent = (content) => {
    // Implement a simple hash function for demonstration purposes
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 12);
  };

  #runBackgroundGeneration = async (projectId, prompt) => {
    try {
      console.log(
        `[Background AI] Starting generation for project ${projectId}`
      );
      const result = await generateProject(prompt, {
        onPlan: async (plan) => {
          console.log(
            `[Background AI] Plan created for project ${projectId}. Planned ${plan.files.length} files.`
          );

          const fileList = plan.files
            .map((f) => `- \`${f.path}\`: ${f.description}`)
            .join('\n');
          console.log('fileList', fileList);

          let isUpdated = await this.projectRepository.saveFilePlan({
            projectId,
            plan,
            fileList,
          });

          if (!isUpdated) {
            throw new AppError(
              HTTP_STATUS.NOT_FOUND,
              ERROR_MESSAGES.PROJECT_NOT_FOUND
            );
          }
        },
        onFileStart: async (path) => {
          console.log(
            `[Background AI] Starting file ${path} for project ${projectId}`
          );

          const isUpdated = await this.projectRepository.setCurrentFile({
            projectId,
            path,
          });

          if (!isUpdated) {
            throw new AppError(
              HTTP_STATUS.NOT_FOUND,
              ERROR_MESSAGES.PROJECT_NOT_FOUND
            );
          }
        },
        onFileComplete: async (path, code) => {
          console.log(
            `[Background AI] Starting file ${path} for project ${projectId}`
          );

          const isSaved = await this.projectRepository.saveGeneratedFile({
            projectId,
            path,
            code,
            hash: this.#hashContent(code),
          });

          if (!isSaved) {
            throw new AppError(
              HTTP_STATUS.NOT_FOUND,
              ERROR_MESSAGES.PROJECT_NOT_FOUND
            );
          }
        },
      });
      console.log(
        `[Background AI] Successfully generated project ${projectId}`
      );

      await this.projectRepository.markGenerationCompleted({
        projectId,
        description: result.description,
      });
    } catch (error) {
      await this.projectRepository.markGenerationFailed({
        projectId,
        errorMsg: error.message,
      });
      throw error;
    }
  };

  createProject = async (prompt, userId) => {
    const payload = {
      name: 'Planning project....',
      description: prompt,
      files: {},
      messages: [
        { role: 'User', content: prompt },
        { role: 'User', content: 'Planning project structure...' },
      ],
      version: 0,
      owner: userId,
      status: PROJECT_STATUS.PENDING,
      filesPlanned: [],
      filesGenerated: [],
      currentFile: null,
      error: null,
    };

    const project = this.projectRepository.create(payload);

    this.#runBackgroundGeneration(project._id.toString(), prompt).catch(
      (err) => {
        console.error(
          `[Background AI] Fatal generation error for project ${project._id}:`,
          err
        );
      }
    );

    return project;
  };

  listProjects = async (userId) => {
    return this.projectRepository.listOwnedSummaries(userId);
  };

  getProject = async ({ userId, projectId }) => {
    const project = await this.projectRepository.findOwnedById({
      userId,
      projectId,
    });
    if (!project) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    console.log('Project files:', project.files);

    const filesObj = {};
    for (const [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }
    console.log('Project files object:', filesObj);

    return {
      ...project,
      files: filesObj,
    };
  };

  deleteProject = async ({ userId, projectId }) => {
    const isDeleted = await this.projectRepository.deleteOwned({
      userId,
      projectId,
    });
    if (!isDeleted) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }
  };

  updateProjectFiles = async ({ userId, projectId, files }) => {
    const project = await this.projectRepository.findOwnedById({
      userId,
      projectId,
    });

    if (!project) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const newFiles = {};

    for (const [path, content] of Object.entries(files)) {
      if (typeof content === 'string') {
        newFiles[path] = { content, hash: this.#hashContent(content) };
      }
    }

    project.files = newFiles;

    const updatedProject = await this.projectRepository.replaceFiles({
      userId,
      projectId,
      files: newFiles,
    });

    if (!updatedProject) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    const filesObj = {};
    for (const [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      files: filesObj,
      messages: project.messages,
      version: project.version,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  };

  publishProject = async ({ userId, projectId }) => {
    const updatedProject = await this.projectRepository.publishOwned({
      userId,
      projectId,
    });

    if (!updatedProject) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    return true;
  };

  getPublicProject = async ({ projectId }) => {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.PROJECT_NOT_FOUND
      );
    }

    if (!project.published) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.PROJECT_NOT_PUBLISH
      );
    }
    console.log('Project files:', project.files);

    const filesObj = {};
    for (const [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }
    console.log('Project files object:', filesObj);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      files: filesObj,
      version: project.version,
    };
  };
}
