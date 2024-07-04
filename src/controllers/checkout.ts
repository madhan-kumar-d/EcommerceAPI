import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';

// Admin
export const getCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, perPage = 10, page = 1 } = req.body;
  const skip = (page - 1) * perPage;
  const query: [userId?: any] = [];
  if (!userId) {
    query.push({
      userId: +userId,
    });
  }
  const orderID = await prismaClient.order.findMany({
    skip,
    take: +perPage,
    where?: [query],
  });

  res.end();
};
