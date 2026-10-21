import { PROJECT_STATUS } from '../constants/project.constants.js';
import { Project } from '../models/projectModel.js';
// password select is false (by default)

export class ProjectRepository {
  #mapProject(project) {
    return {
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      files: project.files,
      messages: project.messages.map((message) => ({
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
      })),
      version: project.version,
      owner: project.owner?.toString(),
      published: project.published,
      status: project.status,
      filesPlanned: project.filesPlanned.map((file) => ({
        path: file.path,
        description: file.description,
      })),
      filesGenerated: project.filesGenerated,
      currentFile: project.currentFile,
      error: project.error,
      createdAt: project.createdAt,
    };
  }

  async create(projectData) {
    const project = await Project.create(projectData);
    return this.#mapProject(project);
  }

  async listOwnedSummaries(userId) {
    const projects = await Project.find(
      { owner: userId },
      {
        name: 1,
        description: 1,
        version: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort({ updatedAt: -1 });

    return projects.map((project) => ({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      version: project.version,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async findOwnedById({ userId, projectId }) {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
    });

    return project ? this.#mapProject(project) : null;
  }

  async findById(projectId) {
    const project = await Project.findById(projectId);
    return project ? this.#mapProject(project) : null;
  }

  async deleteOwned({ userId, projectId }) {
    const result = await Project.deleteOne({
      _id: projectId,
      owner: userId,
    });
    return result.deletedCount > 0;
  }

  async replaceFiles({ userId, projectId, files }) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, owner: userId },
      { $set: { files } }
      // { returnDocument: 'after' }
    );
    return updatedProject ? this.#mapProject(updatedProject) : null;
  }

  async publishOwned({ userId, projectId }) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, owner: userId },
      { $set: { published: true } }
    );
    return Boolean(updatedProject);
  }

  async saveFilePlan({ projectId, plan, fileList }) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $set: {
          name: plan.projectName || 'Generated Project',
          status: PROJECT_STATUS.GENERATING,
          filesPlanned: plan.files,
        },
        $push: {
          messages: {
            role: 'assistant',
            content: `Planned website structure:\n${fileList}`,
            timestamp: new Date(),
          },
        },
      }
    );
    return Boolean(updatedProject);
  }

  async setCurrentFile({ projectId, path }) {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { currentFile: path },
      }
    );
    return Boolean(updatedProject);
  }

  async saveGeneratedFile({ projectId, path, code, hash }) {
    const message = {
      role: 'assistant',
      content: `Created file "${path}"`,
      timestamp: new Date(),
    };

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      [
        {
          $set: {
            files: {
              $setField: {
                field: { $literal: path },
                input: { $ifNull: ['$files', {}] },
                value: {
                  content: { $literal: code },
                  hash: { $literal: hash },
                },
              },
            },
            filesGenerated: {
              $let: {
                vars: {
                  existing: {
                    $ifNull: ['$filesGenerated', []],
                  },
                },
                in: {
                  $cond: [
                    { $in: [{ $literal: path }, '$$existing'] },
                    '$$existing',
                    {
                      $concatArrays: ['$$existing', [{ $literal: path }]],
                    },
                  ],
                },
              },
            },
            messages: {
              $concatArrays: [
                { $ifNull: ['$messages', []] },
                [{ $literal: message }],
              ],
            },
            currentFile: null,
          },
        },
      ],
      { returnDocument: 'after' }
    );

    return Boolean(updatedProject);
  }

  async markGenerationCompleted({ projectId, description }) {
    const updates = {
      $set: {
        status: PROJECT_STATUS.COMPLETED,
        version: 1,
      },
      $push: {
        messages: {
          role: 'assistant',
          content:
            'Website generation complete! You can view and edit the files',
          timestamp: new Date(),
        },
      },
    };

    if (description) {
      updates.$set.description = description;
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, updates);

    return Boolean(updatedProject);
  }

  async markGenerationFailed({ projectId, errorMsg }) {
    const message = {
      role: 'assistant',
      content: `Generation failed: ${errorMsg}`,
      timestamp: new Date(),
    };
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $set: {
          status: PROJECT_STATUS.FAILED,
          error: errorMsg,
        },
        $push: {
          messages: message,
        },
      }
    );

    return Boolean(updatedProject);
  }

  async startRevision({ projectId, userId, prompt }) {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        owner: userId,
      },
      {
        $set: {
          status: PROJECT_STATUS.REVISING,
        },
        $push: {
          messages: {
            role: 'user',
            content: prompt,
            timestamp: new Date(),
          },
        },
      },
      { returnDocument: 'after' }
    );

    return project ? this.#mapProject(project) : null;
  }

  async saveRevision({ projectId, userId, files, message }) {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: projectId,
        owner: userId,
      },
      {
        $set: {
          files,
          status: PROJECT_STATUS.COMPLETED,
        },
        $inc: {
          version: 1,
        },
        $push: {
          messages: {
            role: 'assistant',
            content: message,
            timestamp: new Date(),
          },
        },
      },
      { returnDocument: 'after' }
    );

    return updatedProject ? this.#mapProject(updatedProject) : null;
  }

  async setRevisionStatus({ projectId, userId, status }) {
    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: projectId,
        owner: userId,
      },
      {
        $set: { status },
      }
    );

    return Boolean(updatedProject);
  }
}
