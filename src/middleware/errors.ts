import { STATUS_CODES } from 'http';
import { Response, Request, NextFunction } from 'express';
import { errorCodes, HTTPException } from '../exceptions/root';

export const errorMiddleware = (
  error: HTTPException | any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error.isJoi) {
    res.status(422).json({
      message: error.name,
      errorCodes: errorCodes.UNABLE_TO_PROCESS_INPUT_DATA,
      errors: error.details.map((details: any) => details.message).join(', '),
    });
  } else if (error instanceof HTTPException) {
    res.status(error.statusCode).json({
      message: error.message,
      errorCodes: error.errorCode,
      errors: error.error,
    });
  } else {
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      errors: error.stack,
    });
  }
};
