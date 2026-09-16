import { z } from 'zod';

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1, 'Token erforderlich'),
});

export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;
