// import { AUTH_SESSION_COOKIE_AGE } from '../constants/auth.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { SUCCESS_MESSAGES } from '../constants/messages.constants.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ProjectController {
  /**
   *
   * @param {import("../service/projectService.js").ProjectService} projectService``
   */

  constructor(projectService) {
    this.projectService = projectService;
  }

  createProject = async (req, res) => {
    const { prompt } = req.validatedBody;
    const userId = req.user.userId;

    const projectInfo = await this.projectService.createProject(prompt, userId);

    sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGES.PROJECT_CREATION_SUCCESS,
      { projectInfo }
    );
  };

  listProjects = async (req, res) => {
    const projects = await this.projectService.listProjects(req.user.userId);

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_LIST_SUCCESS, {
      projects,
    });
  };

  getProject = async (req, res) => {
    const userId = req.user.userId; // Assuming you have user information in the request object
    const projectId = req.validatedParams.id;

    const project = await this.projectService.getProject({ userId, projectId });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_GET_SUCCESS, {
      project,
    });
  };

  updateProjectFiles = async (req, res) => {
    const files = req.validatedBody.files;
    const projectId = req.validatedParams.id;
    const userId = req.user.userId;

    const updatedProject = await this.projectService.updateProjectFiles({
      userId,
      projectId,
      files,
    });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_UPDATE_SUCCESS, {
      updatedProject,
    });
  };

  publishProject = async (req, res) => {
    const projectId = req.validatedParams.id;
    const userId = req.user.userId;

    const isPublish = await this.projectService.publishProject({
      projectId,
      userId,
    });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_PUBLISH_SUCCESS, {
      isPublish,
    });
  };

  getPublicProject = async (req, res) => {
    const projectId = req.validatedParams.id;

    const project = await this.projectService.getPublicProject({
      projectId,
    });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_GET_SUCCESS, {
      project,
    });
  };

  deleteProject = async (req, res) => {
    await this.projectService.deleteProject({
      userId: req.user.userId,
      projectId: req.validatedParams.id,
    });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROJECT_DELETE_SUCCESS);
  };
}
