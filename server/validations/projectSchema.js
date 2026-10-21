import { z } from 'zod';

// Create project
export const createProjectSchema = z.object({
  prompt: z
    .string({ error: 'Prompt is required' })
    .trim()
    .min(1, 'Prompt is required'),
});

// Project ID params
export const projectIdSchema = z.object({
  id: z.string({ error: 'Project ID is required' }),
});

// Update project files
export const updateProjectFilesSchema = z.object({
  files: z.unknown({
    error: 'Files is required',
  }),
});
