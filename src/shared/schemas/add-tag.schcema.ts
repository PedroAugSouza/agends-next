import { z } from 'zod';

export const addTagSchema = z.object({
  name: z.string().min(1, ''),
  color: z.string().min(1, ''),
});
