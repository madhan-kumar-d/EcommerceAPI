import { Router } from 'express';
import {
  createCheckout,
  getCheckout,
  updateCheckoutStatus,
} from '../controllers/checkout';
import { errorHandler } from '../errorHandler';
import { isAdmin, validateToken } from '../middleware/auth';
import { validator } from '../middleware/validator';
import {
  createCheckoutSchema,
  updateCheckoutStatusSchema,
} from '../validator.Schema/checkout';

const checkoutRouter = Router();

checkoutRouter.get('/', errorHandler(validateToken), errorHandler(getCheckout));
checkoutRouter.post(
  '/',
  [errorHandler(validateToken), validator(createCheckoutSchema)],
  errorHandler(createCheckout),
);
// update status
checkoutRouter.put(
  '/',
  [
    errorHandler(validateToken),
    errorHandler(isAdmin),
    validator(updateCheckoutStatusSchema),
  ],
  updateCheckoutStatus,
);
export default checkoutRouter;
