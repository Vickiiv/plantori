import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token fehlt'),
  newPassword: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein.'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
