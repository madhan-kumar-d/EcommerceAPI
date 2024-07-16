import { Request, Response } from 'express';
import { prismaClient } from '..';
import { noRecordFound } from '../exceptions/noRecordsFound';
import { errorCodes } from '../exceptions/root';
import { ORDERSTATUS } from '@prisma/client';

// Admin 8
export const getCheckout = async (req: Request, res: Response) => {
  const { perPage = 10, page = 1 } = req.body;
  const skip = (page - 1) * perPage;
  const query: [userId?: any] = [];
  const userId = req.user?.id;
  const userRole = req.user?.role;
  console.log(userRole);
  if (userId && userRole != 'ADMIN') {
    query.push({
      userId: +userId,
    });
  }
  const orderID = await prismaClient.order.findMany({
    skip,
    take: +perPage,
    where: query.length > 0 ? { AND: query } : undefined,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          uniqueID: true,
        },
      },
    },
  });
  res.json(orderID);
};

export const createCheckout = async (req: Request, res: Response) => {
  const { cartId = undefined, address, pinCode } = req.body;
  const items = await prismaClient.cartItem.findMany({
    where: {
      id: {
        in: cartId,
      },
      userId: req.user.id,
      orderId: null,
    },
    include: {
      Product: {
        select: {
          price: true,
        },
      },
    },
  });
  if (!items) {
    throw new noRecordFound(
      'Cart items not found',
      errorCodes.NO_DATA_FOUND,
      null,
    );
  }
  const orderDetails: { totalQuantity: number; netAmount: number } = {
    totalQuantity: 0,
    netAmount: 0,
  };
  items.forEach((item) => {
    // price is decimal from prisma but in typescript all are number so convert product price to number by adding +
    orderDetails.netAmount = orderDetails.netAmount + +item.Product.price;
    orderDetails.totalQuantity = orderDetails.totalQuantity + item.quantity;
  });
  console.log(orderDetails);
  if (!orderDetails.netAmount) {
    throw new noRecordFound(
      'Cart items not found',
      errorCodes.NO_DATA_FOUND,
      null,
    );
  }
  const order = await prismaClient.order.create({
    data: {
      userId: +req.user.id,
      pinCode,
      address,
      totalQuantity: orderDetails.totalQuantity,
      netAmount: orderDetails.netAmount,
    },
  });
  if (order) {
    await prismaClient.orderStatus.create({
      data: {
        orderStatus: 'PENDING',
        orderID: order.id,
      },
    });
    items.forEach(async (item) => {
      await prismaClient.cartItem.update({
        data: {
          orderId: order.id,
        },
        where: {
          id: item.id,
        },
      });
    });
  }
  res.json(order);
};

export const updateCheckoutStatus = async (req: Request, res: Response) => {
  const { orderId, status }: { orderId: number; status: ORDERSTATUS } =
    req.body;
  const order = await prismaClient.order.findFirst({
    where: {
      id: orderId,
    },
  });
  if (!order) {
    throw new noRecordFound(
      'Order is not exist',
      errorCodes.NO_DATA_FOUND,
      null,
    );
  }
  const updateOrder = await prismaClient.order.update({
    data: {
      orderStatus: status,
    },
    where: {
      id: order.id,
    },
  });
  await prismaClient.orderStatus.create({
    data: {
      orderID: order.id,
      orderStatus: status,
    },
  });
  res.json(updateOrder);
};
