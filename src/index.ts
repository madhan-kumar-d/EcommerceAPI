import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import secrets from './secrets';
import mainRouter from './routes';
import * as cron from 'node-cron';
import { errorMiddleware } from './middleware/errors';
import { error404 } from './middleware/error404';
import { errorHandler } from './errorHandler';
declare module 'express-serve-static-core' {
  interface Request {
    clientIp: any;
    userAgent: string;
    user: any;
  }
}
const app: Express = express();
const PORT = secrets.PORT;

export const uploads = multer({ dest: 'public/uploads' });

app.use(express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  req.userAgent = req.headers['user-agent']!;
  next();
});
app.use('/', mainRouter);

export const prismaClient = new PrismaClient({
  log: ['query', 'error'],
});
app.use(errorHandler(error404));
app.use(errorMiddleware);

cron.schedule('* * * * *', async () => {
  try {
    const date = new Date().toISOString();
    await prismaClient.tokens.deleteMany({
      where: {
        expiresAt: {
          lt: date,
        },
      },
    });
    console.log('cron Runs');
  } catch (error: any) {
    console.log(error);
  }
});
app.listen(PORT, () => {
  console.log(`app started at ${PORT}`);
});
