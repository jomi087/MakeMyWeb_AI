import { Router } from 'express';

import authRoutes from './authRoute.js';
import projectRoutes from './projectRoute.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
