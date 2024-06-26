import { Router } from 'express';
import { login, signup, token } from '../controllers/auth';
import { errorHandler } from '../errorHandler';
import { validator } from '../middleware/validator';
import { loginSchema, registerSchema, tokenSchema } from '../validator.Schema';
import { validateToken } from '../middleware/token';

const authRouter: Router = Router();

authRouter.post('/login', validator(loginSchema), errorHandler(login));
authRouter.post('/signup', validator(registerSchema), errorHandler(signup));
authRouter.post('/token', validator(tokenSchema), errorHandler(token));
authRouter.get('/logout', [validateToken], () => {});

export default authRouter;
