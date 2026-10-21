import { z } from 'zod';

export const chatPromptSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
});
