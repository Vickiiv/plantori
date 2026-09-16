import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Bitte eine gueltige E-Mail-Adresse eingeben.'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
