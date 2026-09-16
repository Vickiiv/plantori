import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET fehlt in der .env Datei');
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET fehlt in der .env Datei');
  }
  return jwt.verify(token, secret) as TokenPayload;
}
