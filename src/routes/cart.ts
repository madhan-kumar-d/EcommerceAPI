import { Router } from 'express';
import { getValidator, validator } from '../middleware/validator.js';
import {
  cartCreateSchema,
  cartQuerySchema,
  cartUpdateSchema,
} from '../validator.Schema/cart.js';
import { validateToken } from '../middleware/auth.js';
import { errorHandler } from '../errorHandler.js';
import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
} from '../controllers/cart.js';

const cartRouter = Router();

cartRouter.get('/', [errorHandler(validateToken)], errorHandler(getCart));
cartRouter.post(
  '/',
  [errorHandler(validateToken), validator(cartCreateSchema)],
  errorHandler(createCart),
);
cartRouter.patch(
  '/:id',
  [
    errorHandler(validateToken),
    getValidator(cartQuerySchema),
    validator(cartUpdateSchema),
  ],
  errorHandler(updateCart),
);
cartRouter.delete(
  '/:id',
  [errorHandler(validateToken), getValidator(cartQuerySchema)],
  errorHandler(deleteCart),
);

export default cartRouter;
