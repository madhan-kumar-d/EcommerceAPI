import { HTTPException } from '../exceptions/root';
import { Response, Request, NextFunction } from 'express';

export const errorMiddleware = (
  error: HTTPException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCodes: error.errorCode,
    errors: error.error,
  });
};
