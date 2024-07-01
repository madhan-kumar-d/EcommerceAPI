// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, Router } from 'express';
import { is_admin, validateToken } from '../middleware/auth';
import { errorHandler } from '../errorHandler';
import {
  createProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from '../controllers/product';
import { getValidator, validator } from '../middleware/validator';
import {
  createProductSchema,
  queryProductSchema,
  searchSchema,
} from '../validator.Schema/products';

const productRoute = Router();
productRoute.get(
  '/:productID',
  [errorHandler(validateToken), getValidator(queryProductSchema)],
  errorHandler(getProducts),
);
productRoute.post(
  '/',
  [
    errorHandler(validateToken),
    errorHandler(is_admin),
    validator(createProductSchema),
  ],
  errorHandler(createProduct),
);
productRoute.put(
  '/:productID',
  [
    errorHandler(validateToken),
    errorHandler(is_admin),
    validator(createProductSchema),
    getValidator(queryProductSchema),
  ],
  errorHandler(updateProduct),
);
productRoute.delete(
  '/:productID',
  [
    errorHandler(validateToken),
    errorHandler(is_admin),
    getValidator(queryProductSchema),
  ],
  errorHandler(deleteProduct),
);

productRoute.post(
  '/search',
  [
    errorHandler(validateToken),
    errorHandler(is_admin),
    validator(searchSchema),
  ],
  searchProducts,
);

export default productRoute;
