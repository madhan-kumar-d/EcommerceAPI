import { Response, Request, NextFunction } from 'express';
import { errorCodes, HTTPException } from '../exceptions/root';
import jwt from 'jsonwebtoken';
import { log } from '../utils/logger';
import { Prisma } from '@prisma/client';

// In modern ESM environments (Node.js with "type": "module"), you cannot directly import named exports from a CommonJS module unless they are explicitly defined.
// The `jsonwebtoken` library is written in CommonJS, so named imports like `import { JsonWebTokenError } from 'jsonwebtoken';` will fail.
const { JsonWebTokenError } = jwt;

export const errorMiddleware = (
  error: HTTPException | any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (error.isJoi) {
    const errors = error.details
      .map((details: any) => details.message)
      .join(', ');
    log.info(error.name, { message: errors });
    res.status(422).json({
      message: error.name,
      errorCodes: errorCodes.UNABLE_TO_PROCESS_INPUT_DATA,
      errors,
    });
  } else if (error instanceof HTTPException) {
    log.error(error.message, {
      message: error.error,
      errorCodes: error.errorCode,
    });
    res.status(error.statusCode).json({
      message: error.message,
      errorCodes: error.errorCode,
      errors: error.error,
    });
  } else if (error instanceof JsonWebTokenError) {
    log.info(error.message, { message: '' });
    res.status(401).json({
      message: error.message,
      errorCodes: errorCodes.UNAUTHORIZED_ACCESS,
    });
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    log.error('DB connection error', {
      message: error.stack,
    }); // To save it in different log sheet marking it as Warn
    res.status(500).json({
      message: 'DB connection error',
      errors: 'Please contact admin',
    });
  } else {
    log.error(error.message, { message: error.stack });
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      errors: 'Please contact admin',
    });
  }
};
