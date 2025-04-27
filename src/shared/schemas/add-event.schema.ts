import { all } from 'axios';
import { z } from 'zod';

export const addEventSchema = z.object({
  name: z.string(),
  date: z.date({
    required_error: 'Insira uma data.',
    invalid_type_error: 'Data inválida.',
  }),
  allDay: z.boolean().default(false),
  startTimeMinutes: z.string().nullable(),
  endTimeMinutes: z.string().nullable(),
  startTimeHours: z.string().nullable(),
  endTimeHours: z.string().nullable(),
  asssignedUsers: z.array(z.object({ user: z.string() })),
  tagUuid: z.string(),
});
