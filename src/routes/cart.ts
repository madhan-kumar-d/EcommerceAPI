import { Router } from 'express';
import { getValidator, validator } from '../middleware/validator';
import {
  cartCreateSchema,
  cartQuerySchema,
  cartUpdateSchema,
} from '../validator.Schema/cart';
import { validateToken } from '../middleware/auth';
import { errorHandler } from '../errorHandler';
import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
} from '../controllers/cart';

const cartRouter = Router();

cartRouter.get('/', [errorHandler(validateToken)], errorHandler(getCart));
cartRouter.post(
  '/',
  [errorHandler(validateToken), validator(cartCreateSchema)],
  errorHandler(createCart),
);
cartRouter.patch(
  '/:id',
  [getValidator(cartQuerySchema), validator(cartUpdateSchema)],
  errorHandler(updateCart),
);
cartRouter.delete(
  '/:id',
  [getValidator(cartQuerySchema)],
  errorHandler(deleteCart),
);

export default cartRouter;
