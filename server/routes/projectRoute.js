import { Router } from 'express';
import { projectController } from '../container/projectContainer.js';
import { chatController } from '../container/chatContainer.js';

import {
  createProjectSchema,
  projectIdSchema,
  updateProjectFilesSchema,
} from '../validations/projectSchema.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { chatPromptSchema } from '../validations/chatSchema.js';

const router = Router();

// Public routes
router.get(
  '/public/:id',
  validateRequest(projectIdSchema, 'params'),
  projectController.getPublicProject
);

// Private routes — authentication required
router.use(authenticate);

// Project collection
router
  .route('/')
  .post(validateRequest(createProjectSchema), projectController.createProject)
  .get(projectController.listProjects);

// Individual project
router
  .route('/:id')
  .get(validateRequest(projectIdSchema, 'params'), projectController.getProject)
  .delete(
    validateRequest(projectIdSchema, 'params'),
    projectController.deleteProject
  );

// Project files
router.patch(
  '/:id/files',
  validateRequest(projectIdSchema, 'params'),
  validateRequest(updateProjectFilesSchema),
  projectController.updateProjectFiles
);

// Project publishing
router.post(
  '/:id/publish',
  validateRequest(projectIdSchema, 'params'),
  projectController.publishProject
);

router.post(
  ':id/chat',
  validateRequest(chatPromptSchema),
  validateRequest(projectIdSchema, 'params'),
  chatController.reviseProject
);

export default router;
