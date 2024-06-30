import { Router } from 'express';
import { aboutMe, login, logout, signup, token } from '../controllers/auth';
import { errorHandler } from '../errorHandler';
import { validator } from '../middleware/validator';
import { loginSchema, registerSchema, tokenSchema } from '../validator.Schema';
import { validateToken } from '../middleware/auth';

const authRouter: Router = Router();

authRouter.post('/login', validator(loginSchema), errorHandler(login));
authRouter.post('/signup', validator(registerSchema), errorHandler(signup));
authRouter.post('/token', validator(tokenSchema), errorHandler(token));
authRouter.get(
  '/aboutme',
  [errorHandler(validateToken)],
  errorHandler(aboutMe),
);

// Delete all token if user wants to logout for logging out from a device delete token from client
authRouter.get('/logout', [errorHandler(validateToken)], errorHandler(logout));

export default authRouter;
