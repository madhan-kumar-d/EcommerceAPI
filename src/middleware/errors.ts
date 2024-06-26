import { Response, Request, NextFunction } from 'express';
import { errorCodes, HTTPException } from '../exceptions/root';
import { JsonWebTokenError } from 'jsonwebtoken';

export const errorMiddleware = (
  error: HTTPException | any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.log(error instanceof JsonWebTokenError);
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
  } else if (error instanceof JsonWebTokenError) {
    res.status(401).json({
      message: error.message,
      errorCodes: errorCodes.UNAUTHORIZED_ACCESS,
    });
  } else {
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      errors: error.stack,
    });
  }
};
