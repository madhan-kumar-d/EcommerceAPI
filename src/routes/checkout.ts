import { Router } from 'express';
import { createCheckout, getCheckout } from '../controllers/checkout';
import { errorHandler } from '../errorHandler';
import { validateToken } from '../middleware/auth';

const checkoutRouter = Router();

checkoutRouter.get('/', errorHandler(validateToken), getCheckout);
checkoutRouter.post('/', errorHandler(validateToken), createCheckout);

export default checkoutRouter;
