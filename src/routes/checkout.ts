import { Router } from 'express';
import { getCheckout } from '../controllers/checkout';
import { errorHandler } from '../errorHandler';
import { validateToken } from '../middleware/auth';

const checkoutRouter = Router();

checkoutRouter.get('/', errorHandler(validateToken), getCheckout);

export default checkoutRouter;
