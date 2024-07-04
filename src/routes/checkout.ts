import { Router } from 'express';
import { getCheckout } from '../controllers/checkout';

const checkoutRouter = Router();

checkoutRouter.get('/', getCheckout);

export default checkoutRouter;
