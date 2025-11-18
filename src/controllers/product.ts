import fs from 'node:fs';
import { Request, Response } from 'express';
import { prismaClient } from '../index';
import { noRecordFound } from '../exceptions/noRecordsFound';
import { errorCodes } from '../exceptions/root';

export const getProducts = async (req: Request, res: Response) => {
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
  res.json({
    ...product,
    id: product.id.toString(),
    productImage: req.fullLink + '/' + product.productImage,
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, MRP } = req.body;
  const productImage = req.file?.destination + '/' + req.file?.filename;
  const product = await prismaClient.product.create({
    data: {
      name,
      description,
      price,
      MRP,
      productImage,
    },
  });
  res.json({
    ...product,
    id: product.id.toString(),
    productImage: req.fullLink + '/' + product.productImage,
  });
};
export const updateProduct = async (req: Request, res: Response) => {
  const { name, description, price, MRP } = req.body;
  const productImage = req.file?.destination + '/' + req.file?.filename;
  const { productID } = req.params;
  const productSearch = await prismaClient.product.findFirst({
    where: {
      id: +productID,
    },
    select: {
      productImage: true,
      id: true,
    },
  });

  if (!productSearch) {
    throw new noRecordFound(
      'No data found',
      errorCodes.NO_DATA_FOUND,
      'Product not found',
    );
  }

  if (req.file) {
    // Delete Old image
    if (fs.existsSync(productSearch.productImage!))
      fs.unlinkSync(productSearch.productImage!);
    await prismaClient.product.update({
      data: {
        productImage,
      },
      where: {
        id: +productID,
      },
    });
  }
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
  // fix `Do not know how to serialize a BigInt` error in prisma
  res.json({
    ...product,
    id: product.id.toString(),
    productImage: req.fullLink + '/' + product.productImage,
  });
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { productID } = req.params;
  const productSearch = await prismaClient.product.findFirst({
    where: {
      id: +productID,
    },
  });
  if (!productSearch) {
    throw new noRecordFound(
      'No data found',
      errorCodes.NO_DATA_FOUND,
      'Product not found',
    );
  }
  const alreadyUsed = await prismaClient.product.findFirst({
    where: {
      id: +productID,
      CartItem: {
        none: {
          productID: +productID,
        },
      },
    },
  });
  if (!alreadyUsed) {
    throw new noRecordFound(
      'No data found',
      errorCodes.NO_DATA_FOUND,
      'Product in use',
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
  const { name, description, perPage = 10, page = 1 } = req.body;
  const skip = (+page - 1) * +perPage;
  const query: [name?: string, description?: any] = [];
  // search is pending
  if (name) {
    query.push({
      name: {
        contains: name,
      },
    });
  }
  if (description) {
    query.push({
      description: {
        contains: description,
      },
    });
  }
  const products = await prismaClient.product.findMany({
    skip,
    take: +perPage,
    where: query.length > 0 ? { OR: query } : undefined,
  });

  res.json(
    products.map((product) => {
      return {
        ...product,
        id: product.id.toString(),
        productImage: req.fullLink + '/' + product.productImage,
      };
    }),
  );
};
