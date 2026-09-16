import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
};

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, E-Mail und Passwort werden benoetigt' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Passwort muss mindestens 8 Zeichen lang sein' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Fuer diese E-Mail existiert bereits ein Konto' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken({ userId: user.id });
  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort werden benoetigt' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'E-Mail oder Passwort falsch' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'E-Mail oder Passwort falsch' });
  }

  const token = signToken({ userId: user.id });
  res.cookie('token', token, COOKIE_OPTIONS);

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export function logout(req: Request, res: Response) {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Abgemeldet' });
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden' });
  }
  res.json({ user });
}
