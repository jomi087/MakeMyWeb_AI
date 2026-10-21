import { ProjectRepository } from '../repositories/projectRepository.js';
import { ChatService } from '../service/chatService.js';
import { ChatController } from '../controllers/chatController.js';

const projectRepository = new ProjectRepository();
const chatService = new ChatService(projectRepository);

export const chatController = new ChatController(chatService);
