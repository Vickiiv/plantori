import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { AuthRequest } from './auth.middleware';

// Solange kein Email-Provider produktiv laeuft, bleibt die Pruefung ueber
// ENFORCE_EMAIL_VERIFICATION=false in der .env deaktiviert.
export async function requireVerified(req: AuthRequest, res: Response, next: NextFunction) {
  if (!env.ENFORCE_EMAIL_VERIFICATION) {
    return next();
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }
    if (!user.isVerified) {
      throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Bitte bestaetige zuerst deine E-Mail-Adresse.');
    }
    next();
  } catch (error) {
    next(error);
  }
}
