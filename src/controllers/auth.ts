import { Response, Request, NextFunction } from 'express';
import { compare, hash, genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v5 as uuid } from 'uuid';
import { prismaClient } from '../index.ts';
import secrets from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCodes } from '../exceptions/root';
import { conflictException } from '../exceptions/conflicts';
import { hashToken } from '../utils';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  const userExist = await prismaClient.user.findFirst({ where: { email } });
  if (userExist) {
    throw new conflictException(
      'User already exist',
      errorCodes.USER_ALREADY_EXISTS,
      null,
    );
  }
  const salt = await genSalt(10);
  console.log(salt);
  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: await hash(password, salt),
    },
  });
  const accessToken = jwt.sign({ userId: user.id }, secrets.JWT_TOKEN, {
    algorithm: 'HS512',
    expiresIn: secrets.JWT_EXPIRY,
  });
  console.log(accessToken);
  // based on the string uuid v3/v5 will always generate same string
  const time = new Date().getTime();
  const refreshToken = uuid(time + user.email, secrets.UUID_V5_NAMESPACE);
  const refreshTokenHash = hashToken(refreshToken);
  console.log(refreshTokenHash);
  await prismaClient.tokens.create({
    data: {
      token: refreshTokenHash,
      userId: user.id,
      userAgent: '',
      ipAddress: '',
    },
  });
  res.status(201).json({ accessToken, refreshToken });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new BadRequestsException(
      'Invalid Credentials',
      errorCodes.INVALID_USER_CREDENTIALS,
    );
  }
  if (!(await compare(password, user!.password))) {
    throw new BadRequestsException(
      'Invalid Credentials',
      errorCodes.INVALID_USER_CREDENTIALS,
    );
  }
  const accessKey = jwt.sign({ user: user!.id }, secrets.JWT_TOKEN);
  res.json(accessKey);
  //   user = await userModel.create();
};
