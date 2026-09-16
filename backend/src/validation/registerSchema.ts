import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(50),
  email: z.email('Bitte eine gueltige E-Mail-Adresse eingeben.'),
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
