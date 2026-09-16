import { z } from 'zod';

export const changeEmailSchema = z.object({
  newEmail: z.email('Bitte eine gueltige E-Mail-Adresse eingeben.'),
  currentPassword: z.string().min(1, 'Aktuelles Passwort erforderlich'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
