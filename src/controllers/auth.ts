import { Response, Request } from 'express';
import { compare, hash, genSalt } from 'bcrypt';
import { prismaClient } from '../index';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCodes } from '../exceptions/root';
import { conflictException } from '../exceptions/conflicts';
import { generateAccessToken, generateRefreshToken, hashToken } from '../utils';

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
  const accessToken = generateAccessToken(user.uniqueID);
  console.log(accessToken);
  // based on the string uuid v3/v5 will always generate same string
  const refreshToken = await generateRefreshToken(user.id, user.uniqueID, req);
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
  if (!(await compare(password, user.password))) {
    throw new BadRequestsException(
      'Invalid Credentials',
      errorCodes.INVALID_USER_CREDENTIALS,
    );
  }
  const accessToken = generateAccessToken(user.uniqueID);

  const refreshToken = await generateRefreshToken(user.id, user.uniqueID, req);
  res.status(201).json({ accessToken, refreshToken });
};

// Refresh Access token and invalid if its reused/compromised
export const token = async (req: Request, res: Response) => {
  const { token: refreshToken } = req.body;
  const hashedToken = hashToken(refreshToken);
  const currentTime = new Date();
  const currentTimeFormat = currentTime.toISOString();
  // compare in coming token with buffer from db
  const getDetails = await prismaClient.tokens.findFirst({
    where: {
      token: hashedToken,
      isValid: true,
      expiresAt: {
        gt: currentTimeFormat,
      },
    },
    include: {
      userRelation: {
        select: {
          uniqueID: true,
        },
      },
    },
  });
  if (!getDetails) {
    const getCompromised = await prismaClient.tokens.findFirst({
      where: {
        token: hashedToken,
        isValid: false,
        expiresAt: {
          gt: currentTimeFormat,
        },
      },
    });
    console.log(getCompromised);
    if (getCompromised) {
      await prismaClient.tokens.deleteMany({
        where: {
          userId: getCompromised.userId,
        },
      });
    }
    throw new BadRequestsException(
      'Invalid Credentials',
      errorCodes.INVALID_USER_CREDENTIALS,
    );
  }
  await prismaClient.tokens.update({
    where: {
      id: getDetails.id,
    },
    data: {
      isValid: false,
    },
  });
  const accessToken = generateAccessToken(getDetails.userRelation.uniqueID);
  const newRefreshToken = await generateRefreshToken(
    getDetails.userId,
    getDetails.userRelation.uniqueID,
    req,
  );
  res.status(201).json({ accessToken, refreshToken: newRefreshToken });
};

export const aboutMe = async (req: Request, res: Response) => {
  res.status(200).json({ data: req.user, message: '' });
};

export const logout = async (req: Request, res: Response) => {
  await prismaClient.tokens.deleteMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.status(200).json({ message: 'deleted successfully' });
};
