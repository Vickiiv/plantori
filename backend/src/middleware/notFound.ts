import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${req.method} ${req.originalUrl} existiert nicht.`));
}
