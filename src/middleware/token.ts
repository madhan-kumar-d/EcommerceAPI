import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import secrets from '../secrets';
import { unauthenticatedException } from '../exceptions/unauthenticated';
import { errorCodes } from '../exceptions/root';

export const validateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.slice(7);

  console.log(token);
  if (!token) {
    throw new unauthenticatedException(
      'Unauthorized Access',
      errorCodes.UNAUTHORIZED_ACCESS,
      'Invalid Token',
    );
  }
  const decoded = jwt.verify(token!, secrets.JWT_TOKEN) as JwtPayload;
  req.user = decoded.userId;
  next();
};
