import { Router } from 'express';

import authRoutes from './authRoute.js';

export const router = Router();

router.use('/auth', authRoutes);
