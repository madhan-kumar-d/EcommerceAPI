import { Router } from 'express';
import { login, signup } from '../controllers/auth';
import { errorHandler } from '../errorHandler';

const authRouter: Router = Router();

authRouter.post('/login', errorHandler(login));
authRouter.post('/signup', errorHandler(signup));

export default authRouter;
