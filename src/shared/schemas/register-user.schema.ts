import { coerce, z } from 'zod';

export const registerUserSchema = z
  .object({
    name: z.string().min(1, 'Insira um nome.'),
    email: z.string().email('insira um email válido.'),
    password: z
      .string()
      .min(8, { message: 'Deve conter mais de oito caracteres.' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Deve conter letras e números.',
      })
      .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'Deve conter caracteres especiais: _, @, #, etc.',
      }),

    passwordConfirmation: z.string().min(1, 'Confirme sua senha.'),
    dateBirth: z
      .date({
        required_error: 'Insira uma data de nascimento.',
        coerce: true,
      })
      .refine((date) => {
        const now = new Date();
        const minDate = new Date(
          now.getFullYear() - 100,
          now.getMonth(),
          now.getDate(),
        );
        const maxDate = new Date(
          now.getFullYear() - 18,
          now.getMonth(),
          now.getDate(),
        );
        return date >= minDate && date <= maxDate;
      }, 'Você deve ter mais de 18 anos para se cadastrar.'),
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
