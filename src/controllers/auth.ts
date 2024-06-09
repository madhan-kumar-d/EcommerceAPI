import { Response, Request, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '..';
import { JWTTOKEN } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCodes } from '../exceptions/root';
import { error, log } from 'console';
// const userModel = prismaClient.user;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  let userExsist = await prismaClient.user.findFirst({ where: { email } });
  if (userExsist) {
    next(
      new BadRequestsException(
        'User already exist',
        errorCodes.USER_ALREADY_EXISTS,
      ),
    );
  }
  let user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: await hash(password, 10),
    },
  });
  res.json(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  console.log(JWTTOKEN);
  if (!user) {
    next(
      new BadRequestsException(
        'Invalid Credentials',
        errorCodes.INVALID_USER_CREDENTIALS,
      ),
    );
  }
  if (!(await compare(password, user!.password))) {
    next(
      new BadRequestsException(
        'Invalid Credentials',
        errorCodes.INVALID_USER_CREDENTIALS,
      ),
    );
  }
  const accessKey = jwt.sign({ user: user!.id }, JWTTOKEN);
  res.json(accessKey);
  //   user = await userModel.create();
};
