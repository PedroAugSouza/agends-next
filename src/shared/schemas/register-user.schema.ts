import { coerce, z } from 'zod';

export const registerUserSchema = z
  .object({
    name: z.string().min(1, 'Insira um nome.'),
    email: z.string().email('insira um email válido.'),
    password: z
      .string()
      .min(8, { message: '1' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { message: '2' })
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: '3' }),

    passwordConfirmation: z.string().min(1, 'Confirme sua senha.'),
    dateBirth: z.date({
      required_error: 'Insira uma data de nascimento.',
      coerce: true,
    }),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        path: ['passwordConfirmation'],
        message: 'As senhas devem ser iguais',
        code: 'custom',
      });
    }
  });
