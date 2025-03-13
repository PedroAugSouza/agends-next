import { z } from 'zod';

export const authenticateUserSchema = z.object({
  email: z.string().email('Insira um email válido.'),
  password: z.string().min(8, 'Deve conter mais de oito caracteres.'),
});
