import { Router } from 'express';
import {
  createCheckout,
  getCheckout,
  updateCheckoutStatus,
} from '../controllers/checkout.js';
import { errorHandler } from '../errorHandler.js';
import { isAdmin, validateToken } from '../middleware/auth.js';
import { getValidator, validator } from '../middleware/validator.js';
import {
  createCheckoutSchema,
  updateCheckoutStatusSchema,
  updateCheckoutStatusQuerySchema,
} from '../validator.Schema/checkout.js';

const checkoutRouter = Router();

checkoutRouter.get('/', errorHandler(validateToken), errorHandler(getCheckout));
checkoutRouter.post(
  '/',
  [errorHandler(validateToken), validator(createCheckoutSchema)],
  errorHandler(createCheckout),
);
// update status
checkoutRouter.patch(
  '/:id',
  [
    errorHandler(validateToken),
    errorHandler(isAdmin),
    validator(updateCheckoutStatusSchema),
    getValidator(updateCheckoutStatusQuerySchema),
  ],
  errorHandler(updateCheckoutStatus),
);
export default checkoutRouter;
