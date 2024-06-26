import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import secrets from '../secrets';
import { unauthenticatedException } from '../exceptions/unauthenticated';
import { errorCodes } from '../exceptions/root';
import { prismaClient } from '..';

export const validateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.slice(7);
  if (!token) {
    throw new unauthenticatedException(
      'Unauthorized Access',
      errorCodes.UNAUTHORIZED_ACCESS,
      'Invalid Token',
    );
  }
  const decoded = jwt.verify(token!, secrets.JWT_TOKEN) as JwtPayload;
  const users = await prismaClient.user.findFirst({
    where: { id: decoded.userId },
  });
  if (!users) {
    throw new unauthenticatedException(
      'Unauthorized Access',
      errorCodes.UNAUTHORIZED_ACCESS,
      'Invalid Token',
    );
  }
  req.user = users;
  next();
};

export const is_admin = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user.role);
  if (req.user.role !== 'ADMIN') {
    throw new unauthenticatedException(
      'Unauthorized Access',
      errorCodes.UNAUTHORIZED_ACCESS,
      'Admin access only',
    );
  }
  next();
};
