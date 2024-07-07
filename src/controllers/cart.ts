import { Request, Response } from 'express';
import { prismaClient } from '..';
import { noRecordFound } from '../exceptions/noRecordsFound';
import { errorCodes } from '../exceptions/root';

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const cartArr = await prismaClient.cartItem.findMany({
    where: {
      userId,
      orderId: null,
    },
    include: {
      Product: {
        select: {
          name: true,
        },
      },
    },
  });
  const carts = cartArr.map((cart) => {
    return {
      ...cart,
      id: cart.id.toString(),
      productID: cart.productID.toString(),
    };
  });
  res.json(carts);
};

export const createCart = async (req: Request, res: Response) => {
  const { productID, quantity } = req.body;
  const validProduct = await prismaClient.product.findFirst({
    where: {
      id: productID,
    },
  });
  if (!validProduct) {
    throw new noRecordFound(
      'No Record Found',
      errorCodes.NO_DATA_FOUND,
      'Product Not Found',
    );
  }
  const getOldCart = await prismaClient.cartItem.findFirst({
    where: {
      productID,
      userId: +req.user.id,
    },
    select: {
      quantity: true,
      id: true,
    },
  });
  let cart;
  if (!getOldCart) {
    cart = await prismaClient.cartItem.create({
      data: {
        productID,
        quantity,
        userId: +req.user.id,
      },
    });
  } else {
    const newQty = getOldCart.quantity + quantity;
    cart = await prismaClient.cartItem.update({
      data: {
        quantity: newQty,
      },
      where: {
        id: getOldCart.id,
      },
    });
  }
  res.json({
    ...cart,
    id: cart.id.toString(),
    productID: cart.productID.toString(),
  });
};

export const updateCart = async (req: Request, res: Response) => {
  const cartId = +req.params.id;
  const { quantity } = req.body;
  const getCart = await prismaClient.cartItem.findFirst({
    where: {
      id: cartId,
    },
    include: {
      Product: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!getCart) {
    throw new noRecordFound(
      'No Record Found',
      errorCodes.NO_DATA_FOUND,
      'Cart Id Not Found',
    );
  }
  const cart = await prismaClient.cartItem.update({
    data: {
      quantity,
    },
    where: {
      id: cartId,
    },
  });
  res.json({
    ...cart,
    id: cart.id.toString(),
    productID: cart.productID.toString(),
  });
};

export const deleteCart = async (req: Request, res: Response) => {
  const cartId = +req.params.id;
  await prismaClient.cartItem.delete({
    where: {
      id: cartId,
    },
  });
  res.json({ message: 'Cart remvoed successfully' });
};
