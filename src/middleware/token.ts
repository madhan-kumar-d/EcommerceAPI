import { NextFunction, Request, Response } from 'express';

export const validateToken = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const token = req.headers.authorization?.slice(7);
  console.log(token);
  res.end();
};
