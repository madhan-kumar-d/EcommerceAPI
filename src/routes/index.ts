import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
import authRouter from './auth.js';
import productRoute from './product.js';
import cartRouter from './cart.js';
import checkoutRouter from './checkout.js';
import * as swaggerDoc from '../swagger/swaggerDocs.json' with { type: 'json' };

const mainRouter: Router = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/product', productRoute);
mainRouter.use('/cart', cartRouter);
mainRouter.use('/checkout', checkoutRouter);
export default mainRouter;
