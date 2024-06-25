import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import secrets from './secrets';
import mainRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errors';
declare module 'express-serve-static-core' {
  interface Request {
    clientIp?: any;
    userAgent?: string;
  }
}
const app: Express = express();
const PORT = secrets.PORT;

app.use(express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  req.userAgent = req.headers['user-agent'];
  next();
});
app.use('/', mainRouter);

export const prismaClient = new PrismaClient({
  log: ['query', 'error'],
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`app started at ${PORT}`);
});
