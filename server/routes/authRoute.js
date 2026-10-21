import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validations/authSchema.js';
import { authController } from '../container/authContainer.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.userInfo);

export default router;
