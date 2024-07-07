import { Request, Response } from 'express';
import { prismaClient } from '..';

// Admin 8
export const getCheckout = async (req: Request, res: Response) => {
  const { perPage = 10, page = 1 } = req.body;
  const skip = (page - 1) * perPage;
  const query: [userId?: any] = [];
  const userId = req.user?.id;
  const userRole = req.user?.Role;
  if (userId && userRole != 'Admin') {
    query.push({
      userId: +userId,
    });
  }
  const orderID = await prismaClient.order.findMany({
    skip,
    take: +perPage,
    where: query.length > 0 ? { AND: query } : undefined,
  });
  res.json(orderID);
};

export const createCheckout = async (req: Request, res: Response) => {
  const { cartID = null } = req.body;
  console.log(cartID);
  res.end;
};
