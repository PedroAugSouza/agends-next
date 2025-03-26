import { z } from 'zod';

export const addHabitSchema = z.object({
  name: z.string().min(1, ''),
  color: z.string().min(1, ''),
  dayHabit: z.array(z.number()),
});
