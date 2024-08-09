import { Request, Response } from 'express';
import { prismaClient } from '..';
import { noRecordFound } from '../exceptions/noRecordsFound';
import { errorCodes } from '../exceptions/root';
import { ORDERSTATUS } from '@prisma/client';
import orderEmail from './template/orderEmail';
import sendMail from '../middleware/mailer';
import secrets from '../secrets';
import orderUpdateEmail from './template/orderUpdateEmail';

// Admin 8
export const getCheckout = async (req: Request, res: Response) => {
  const { perPage = 10, page = 1 } = req.body;
  const skip = (page - 1) * perPage;
  const query: [userId?: any] = [];
  const userId = req.user?.id;
  const userRole = req.user?.role;

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
  // return res.end();
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
          name: true,
          productImage: true,
        },
      },
    },
  });
  if (!items.length) {
    throw new noRecordFound(
      'Cart items not found',
      errorCodes.NO_DATA_FOUND,
      null,
    );
  }

  interface mProducts {
    img: string;
    name: string;
    quantity: number;
    price: number;
  }
  interface mailProductsDetails {
    products: mProducts[];
    userName: string;
    netAmount: number;
    totalQuantity: number;
    fullLink: string;
  }
  const ProductsDetails: mailProductsDetails = {
    products: [],
    userName: '',
    netAmount: 0,
    totalQuantity: 0,
    fullLink: req.fullLink,
  };
  const orderDetails: { totalQuantity: number; netAmount: number } = {
    totalQuantity: 0,
    netAmount: 0,
  };
  items.forEach((item) => {
    const tempProduct: mProducts = {
      img: req.fullLink + '/' + item.Product.productImage!,
      name: item.Product.name!,
      quantity: item.quantity,
      price: +item.Product.price!,
    };
    // price is decimal from prisma but in typescript all are number so convert product price to number by adding +
    orderDetails.netAmount = orderDetails.netAmount + +item.Product.price;
    orderDetails.totalQuantity = orderDetails.totalQuantity + item.quantity;
    ProductsDetails.products = [...ProductsDetails.products, tempProduct];
  });
  ProductsDetails.netAmount = orderDetails.netAmount;
  ProductsDetails.totalQuantity = orderDetails.totalQuantity;

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

  const orderTemplate = orderEmail(ProductsDetails);
  const subject = secrets.ORDER_EMAIL_SUBJECT.replace(
    '$orderID',
    'ORD' + order.id,
  );
  const content = {
    sendTo: req.user.email,
    subject,
    html: orderTemplate,
    fullLink: req.fullLink,
  };
  await sendMail(content);

  res.json(order);
};

export const updateCheckoutStatus = async (req: Request, res: Response) => {
  const orderId = +req.params.id;
  const { status }: { status: ORDERSTATUS } = req.body;
  const order = await prismaClient.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
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
  interface mailDetails {
    userName: string;
    status: ORDERSTATUS;
    fullLink: string;
  }
  const Details: mailDetails = {
    userName: order.user.name,
    status,
    fullLink: req.fullLink,
  };
  const orderUpdateTemplate = orderUpdateEmail(Details);
  const subject = secrets.ORDER_UPDATE_EMAIL_SUBJECT.replace(
    '$orderID',
    'ORD' + order.id,
  );
  const content = {
    sendTo: req.user.email,
    subject,
    html: orderUpdateTemplate,
    fullLink: req.fullLink,
  };
  await sendMail(content);
  res.json(updateOrder);
};
