import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(50),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
