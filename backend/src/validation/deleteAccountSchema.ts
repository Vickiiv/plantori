import { z } from 'zod';

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Passwort erforderlich'),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
