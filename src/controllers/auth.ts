import { Response, Request } from 'express';
import { compare, hash, genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../index';
import secrets from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCodes } from '../exceptions/root';
import { conflictException } from '../exceptions/conflicts';
import { generateAccessToken, generateRefreshToken } from '../utils';

export const signup = async (req: Request, res: Response) => {
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
  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: await hash(password, salt),
    },
  });
  const accessToken = generateAccessToken(user.id);
  console.log(accessToken);
  // based on the string uuid v3/v5 will always generate same string
  const refreshToken = await generateRefreshToken(user.id, req);
  res.status(201).json({ accessToken, refreshToken });
};

export const login = async (req: Request, res: Response) => {
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
  const accessToken = jwt.sign({ user: user!.id }, secrets.JWT_TOKEN, {
    algorithm: 'HS512',
    expiresIn: secrets.JWT_EXPIRY,
  });
  const refreshToken = await generateRefreshToken(user.id, req);
  res.status(201).json({ accessToken, refreshToken });
};

// Refresh Access token and invalid if its reused/compromised
export const token = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const currentTime = new Date();
  // compare in coming toek with buffer from db
  const getDetails = await prismaClient.tokens.findFirst({
    where: {
      token: refreshToken,
      isValid: true,
      expiresAt: {
        lt: currentTime.toISOString(),
      },
    },
  });
  if (!getDetails) {
    const getCompromised = await prismaClient.tokens.findFirst({
      where: {
        token: refreshToken,
        isValid: false,
        expiresAt: {
          lt: currentTime.toISOString(),
        },
      },
    });
    if (getCompromised) {
      await prismaClient.tokens.deleteMany({
        where: {
          id: getCompromised.userId,
        },
      });
    }
    throw new BadRequestsException(
      'Invalid Credentials',
      errorCodes.INVALID_USER_CREDENTIALS,
    );
  }
  // const accessToken = generateAccessToken(getDetails?.userId);
  // const newRefreshToken = await generateRefreshToken(getDetails?.userId, req);
};
