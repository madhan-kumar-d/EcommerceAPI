import { Router } from 'express';
import authRouter from './auth';
import productRoute from './product';

const mainRouter: Router = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/product', productRoute);

export default mainRouter;
