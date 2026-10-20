import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { signinSchema, signupSchema } from '../validations/authSchema.js';
import { authController } from '../container/authContainer.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', validateRequest(signupSchema), authController.register);
router.post('/signin', validateRequest(signinSchema), authController.login);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.userInfo);

export default router;
