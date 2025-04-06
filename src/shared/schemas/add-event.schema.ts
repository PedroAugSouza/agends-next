import { all } from 'axios';
import { z } from 'zod';

export const addEventSchema = z.object({
  name: z.string(),
  date: z.date({
    required_error: 'Insira uma data.',
    invalid_type_error: 'Data inválida.',
  }),
  allDay: z.boolean().default(false),
  startTimeMinutes: z.string().default('00').nullable(),
  endTimeMinutes: z.string().default('00').nullable(),
  startTimeHours: z.string().default('00').nullable(),
  endTimeHours: z.string().default('00').nullable(),
  tagUuid: z.string(),
});
