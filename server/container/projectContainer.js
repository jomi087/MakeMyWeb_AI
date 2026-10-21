import { ProjectController } from '../controllers/projectController.js';
import { ProjectService } from '../service/projectService.js';
import { ProjectRepository } from '../repositories/projectRepository.js';

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);

export const projectController = new ProjectController(projectService);
