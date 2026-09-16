import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: 'Zu viele Versuche. Bitte versuche es spaeter erneut.', code: 'TOO_MANY_REQUESTS' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Zu viele Versuche. Bitte versuche es spaeter erneut.', code: 'TOO_MANY_REQUESTS' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Fuer seltene, sensible Aktionen (Verifizierung erneut senden, Passwort
// vergessen, Email aendern) reicht EIN gemeinsamer, strenger Limiter -
// spart eigene Limiter pro Endpunkt.
export const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { message: 'Zu viele Anfragen. Bitte spaeter erneut versuchen.', code: 'TOO_MANY_REQUESTS' },
  standardHeaders: true,
  legacyHeaders: false,
});
