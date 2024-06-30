import { Request, Response } from 'express';
import { prismaClient } from '..';
import { noRecordFound } from '../exceptions/noRecordsFound';
import { errorCodes } from '../exceptions/root';

export const getProducts = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const { perPage = 10, page = 1 } = req.query;
  const skip = (+page - 1) * +perPage;
  let query = {};
  if (productID) {
    query = {
      id: +productID,
    };
  }
  const products = await prismaClient.product.findMany({
    skip,
    take: +perPage,
    where: {
      ...query,
    },
  });
  if (products.length === 0) {
    throw new noRecordFound(
      'No data found',
      errorCodes.NO_DATA_FOUND,
      'Products not found',
    );
  }
  const productArr = products.map((product) => {
    return { ...product, id: product.id.toString() };
  });
  res.json(productArr);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, MRP } = req.body;
  const product = await prismaClient.product.create({
    data: {
      name,
      description,
      price,
      MRP,
    },
  });
  res.json({ ...product, id: product.id.toString() });
};
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, MRP } = req.body;
  const { productID } = req.params;
  const product = await prismaClient.product.update({
    data: {
      name,
      description,
      price,
      MRP,
    },
    where: {
      id: +productID,
    },
  });
  res.json({ ...product, id: product.id.toString() });
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const product = await prismaClient.product.findFirst({
    where: {
      id: +productID,
    },
  });
  if (!product) {
    throw new noRecordFound(
      'No data found',
      errorCodes.NO_DATA_FOUND,
      'Product not found',
    );
  }
  // const deleteProduct =
  await prismaClient.product.delete({
    where: {
      id: +productID,
    },
  });
  res.json({
    message: 'Record deleted successfully',
  });
  // data: { ...deleteProduct, id: deleteProduct.id.toString() },
};
export const searchProducts = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { product: productID, search, perPage = 10, page = 1 } = req.body;
  const skip = (+page - 1) * +perPage;
  let query = {};
  // search is pending
  // if (productID) {
  //   query.id =  +productID,
  // }
  if (search) {
    query = {
      name: {
        contains: search,
      },
    };
  }
  const products = await prismaClient.product.findMany({
    skip,
    take: +perPage,
    where: {
      ...query,
    },
  });
  console.log(products);
  res.end();
};
