import { AuthService } from '../service/authService.js';
import { UserRepository } from '../repositories/userRepository.js';
import { AuthController } from '../controllers/authController.js';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const authController = new AuthController(authService);
