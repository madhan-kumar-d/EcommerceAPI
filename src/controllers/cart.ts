import { Request, Response } from 'express';
import { prismaClient } from '../index.js';
import { noRecordFound } from '../exceptions/noRecordsFound.js';
import { errorCodes } from '../exceptions/root.js';

const getCartContent = async (req: Request, userId: number) => {
  const cartArr = await prismaClient.cartItem.findMany({
    where: {
      userId,
      orderId: null,
    },
    include: {
      Product: {
        select: {
          name: true,
          productImage: true,
        },
      },
    },
  });
  return cartArr.map((cart) => {
    return {
      ...cart,
      id: cart.id.toString(),
      productID: cart.productID.toString(),
      Product: {
        ...cart.Product,
        productImage: req.fullLink + '/' + cart.Product.productImage,
      },
    };
  });
};
export const getCart = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const carts = await getCartContent(req, userId);
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
      orderId: null,
    },
    select: {
      quantity: true,
      id: true,
    },
  });
  if (!getOldCart) {
    await prismaClient.cartItem.create({
      data: {
        productID,
        quantity,
        userId: +req.user.id,
      },
      include: {
        Product: {
          select: {
            name: true,
          },
        },
      },
    });
  } else {
    const newQty = getOldCart.quantity + quantity;
    await prismaClient.cartItem.update({
      data: {
        quantity: newQty,
      },
      where: {
        id: getOldCart.id,
      },
    });
  }
  const carts = await getCartContent(req, +req.user.id);
  res.json(carts);
};

export const updateCart = async (req: Request, res: Response) => {
  const cartId = +req.params.id;
  const { quantity } = req.body;
  const getCart = await prismaClient.cartItem.findFirst({
    where: {
      id: cartId,
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
  const getCart = await prismaClient.cartItem.findFirst({
    where: {
      id: cartId,
      orderId: null,
    },
  });
  if (!getCart) {
    throw new noRecordFound(
      'No Record Found',
      errorCodes.NO_DATA_FOUND,
      'Cart Id Not Found',
    );
  }
  await prismaClient.cartItem.delete({
    where: {
      id: cartId,
      orderId: null,
    },
  });
  res.json({ message: 'Cart removed successfully' });
};
