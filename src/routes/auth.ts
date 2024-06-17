import { Router } from 'express';
import { login, signup } from '../controllers/auth';
import { errorHandler } from '../errorHandler';
import { validator } from '../middleware/validator';
import { registerSchema } from '../validator.Schema';

const authRouter: Router = Router();

authRouter.post('/login', errorHandler(login));
authRouter.post('/signup', validator(registerSchema), errorHandler(signup));

export default authRouter;
