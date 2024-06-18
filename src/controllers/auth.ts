import { Response, Request, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from '..';
import { JWTTOKEN } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-request';
import { errorCodes } from '../exceptions/root';
import { conflictException } from '../exceptions/conflicts';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(1111);
  const { name, email, password } = req.body;
  let userExsist = await prismaClient.user.findFirst({ where: { email } });
  if (userExsist) {
    throw new conflictException(
      'User already exist',
      errorCodes.USER_ALREADY_EXISTS,
      null,
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
    // returning next means it will stop the execution, express will trigger next middleware/controller/function even next function is called
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
  const accessKey = jwt.sign({ user: user!.id }, JWTTOKEN);
  res.json(accessKey);
  //   user = await userModel.create();
};
