import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { sendVerificationEmail, sendPasswordResetEmail, sendEmailChangeVerification } from '../utils/sendEmail';
import { AuthRequest } from '../middleware/auth.middleware';
import type { RegisterInput } from '../validation/registerSchema';
import type { LoginInput } from '../validation/loginSchema';
import type { ChangePasswordInput } from '../validation/changePasswordSchema';
import type { ForgotPasswordInput } from '../validation/forgotPasswordSchema';
import type { ResetPasswordInput } from '../validation/resetPasswordSchema';
import type { VerifyEmailQuery } from '../validation/verifyEmailSchema';
import type { ChangeEmailInput } from '../validation/changeEmailSchema';
import type { DeleteAccountInput } from '../validation/deleteAccountSchema';
import type { UpdateProfileInput } from '../validation/updateProfileSchema';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
};

function hashToken(rawToken: string) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function publicUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

// Registrierung
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as RegisterInput;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError(409, 'USER_ALREADY_EXISTS', 'Fuer diese E-Mail existiert bereits ein Konto');
    }

    const user = await User.create({ name, email, password });

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = hashToken(rawToken);
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    try {
      await sendVerificationEmail(user.email, rawToken);
    } catch (emailError) {
      console.error('Verifizierungs-Email konnte nicht gesendet werden:', emailError);
    }

    const token = signToken({ sub: user.id, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({ message: 'Registrierung erfolgreich', user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

// Login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +failedLoginAttempts +lockUntil',
    );

    if (user?.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new AppError(423, 'ACCOUNT_LOCKED', `Zu viele Versuche. Bitte versuch es in ${minutesLeft} Minute(n) erneut.`);
    }

    const isValid = user ? await user.comparePassword(password) : false;

    if (!user || !isValid) {
      if (user) {
        user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        await user.save({ validateModifiedOnly: true });
      }
      throw new AppError(401, 'INVALID_CREDENTIALS', 'E-Mail oder Passwort ist falsch');
    }

    if (user.failedLoginAttempts || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save({ validateModifiedOnly: true });
    }

    const token = signToken({ sub: user.id, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({ message: 'Login erfolgreich', user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

// Logout
export function logout(req: Request, res: Response) {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Abgemeldet' });
}

// Aktuellen Nutzer abrufen
export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

// Email verifizieren (auch fuer bestaetigten Email-Wechsel)
export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.query as unknown as VerifyEmailQuery;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    }).select('+verificationToken +verificationTokenExpires +pendingEmail');

    if (!user) {
      throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'Der Verifizierungslink ist ungueltig oder abgelaufen');
    }

    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    res.json({ message: 'E-Mail erfolgreich verifiziert' });
  } catch (error) {
    next(error);
  }
}

// Verifizierungs-Email erneut senden
export async function resendVerificationEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }
    if (user.isVerified) {
      throw new AppError(400, 'ALREADY_VERIFIED', 'E-Mail ist bereits verifiziert');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = hashToken(rawToken);
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    await sendVerificationEmail(user.email, rawToken);

    res.json({ message: 'Verifizierungs-E-Mail wurde erneut gesendet' });
  } catch (error) {
    next(error);
  }
}

// Passwort-Reset anfordern
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body as ForgotPasswordInput;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Bewusst immer die gleiche Antwort - verraet nicht, ob ein Konto existiert
    const genericResponse = {
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail zum Zuruecksetzen des Passworts gesendet.',
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    try {
      await sendPasswordResetEmail(user.email, rawToken);
    } catch (emailError) {
      console.error('Passwort-Reset-Email konnte nicht gesendet werden:', emailError);
    }

    res.json(genericResponse);
  } catch (error) {
    next(error);
  }
}

// Passwort mit Token zuruecksetzen
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body as ResetPasswordInput;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'Der Link zum Zuruecksetzen ist ungueltig oder abgelaufen');
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    res.json({ message: 'Passwort erfolgreich zurueckgesetzt' });
  } catch (error) {
    next(error);
  }
}

// Eingeloggt Passwort aendern
export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordInput;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Aktuelles Passwort ist falsch');
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save({ validateModifiedOnly: true });

    res.json({ message: 'Passwort erfolgreich geaendert' });
  } catch (error) {
    next(error);
  }
}

// Name aendern
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name } = req.body as UpdateProfileInput;

    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }

    user.name = name;
    await user.save({ validateModifiedOnly: true });

    res.json({ message: 'Profil aktualisiert', user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

// Email-Aenderung anfragen (Bestaetigung passiert ueber verifyEmail)
export async function requestEmailChange(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { newEmail, currentPassword } = req.body as ChangeEmailInput;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Passwort ist falsch');
    }

    const existing = await User.findOne({ email: newEmail.toLowerCase() });
    if (existing) {
      throw new AppError(409, 'EMAIL_ALREADY_IN_USE', 'Diese E-Mail-Adresse wird bereits verwendet');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.pendingEmail = newEmail.toLowerCase();
    user.verificationToken = hashToken(rawToken);
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateModifiedOnly: true });

    await sendEmailChangeVerification(newEmail, rawToken);

    res.json({ message: 'Bestaetigungs-E-Mail an die neue Adresse gesendet' });
  } catch (error) {
    next(error);
  }
}

// Konto loeschen (Soft-Delete + Anonymisierung)
export async function deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { password } = req.body as DeleteAccountInput;

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Benutzer nicht gefunden');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Passwort ist falsch');
    }

    const anonymizedSuffix = user._id.toString();
    user.deletedAt = new Date();
    user.email = `geloescht-${anonymizedSuffix}@deleted.invalid`;
    user.name = 'Geloeschter Nutzer';
    await user.save({ validateModifiedOnly: true });

    res.clearCookie('token', COOKIE_OPTIONS);
    res.json({ message: 'Konto wurde geloescht' });
  } catch (error) {
    next(error);
  }
}
