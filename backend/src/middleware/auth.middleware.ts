import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Nicht angemeldet' });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('+passwordChangedAt');

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: 'Sitzung ungueltig oder abgelaufen' });
    }

    if (user.passwordChangedAt && payload.iat) {
      const changedAtSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (payload.iat < changedAtSeconds) {
        return res.status(401).json({
          message: 'Sitzung abgelaufen, da das Passwort geaendert wurde. Bitte erneut anmelden.',
        });
      }
    }

    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Sitzung ungueltig oder abgelaufen' });
  }
}
