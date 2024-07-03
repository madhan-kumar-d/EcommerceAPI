import { Router } from 'express';
import authRouter from './auth';
import productRoute from './product';
import cartRouter from './cart';

const mainRouter: Router = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/product', productRoute);
mainRouter.use('/cart', cartRouter);
export default mainRouter;
