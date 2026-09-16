import { RequestHandler } from 'express';
import { ZodType, z } from 'zod';
import { AppError } from '../utils/AppError';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodType, target: ValidationTarget = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(new AppError(400, 'VALIDATION_ERROR', 'Ungueltige Anfragedaten', z.flattenError(result.error).fieldErrors));
      return;
    }

    if (target === 'body') {
      req.body = result.data;
    } else {
      Object.defineProperty(req, target, {
        value: result.data,
        writable: true,
        configurable: true,
      });
    }
    next();
  };
}
