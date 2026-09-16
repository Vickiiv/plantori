import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Aktuelles Passwort erforderlich'),
  newPassword: z.string().min(8, 'Das neue Passwort muss mindestens 8 Zeichen lang sein.'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
