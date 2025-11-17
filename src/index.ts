import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import cors from 'cors';
import secrets from './secrets.js';
import mainRouter from './routes/index.js';
import * as cron from 'node-cron';
import { errorMiddleware } from './middleware/errors.js';
import { error404 } from './middleware/error404.js';
import { errorHandler } from './errorHandler.js';
import { limiter } from './middleware/rateLimit.js';
import compression from 'compression';

declare module 'express-serve-static-core' {
  interface Request {
    clientIp: any;
    userAgent: string;
    user: any;
    fullLink: string;
  }
}
const app: Express = express();
const PORT = secrets.PORT;
const corsOptions = {
  credentials: true,
  origin: ['http://127.0.0.1:5500'], // Add domains which all needs to allow
};

app.use(
  compression({
    threshold: 0, // in bytes
  }),
);
app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));

app.use(express.json());
app.use('/public', express.static('public'));
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  req.userAgent = req.headers['user-agent']!;
  req.fullLink = req.protocol + '://' + req.headers.host;
  next();
});
app.use('/', mainRouter);

export const prismaClient = new PrismaClient({
  log: ['query', 'error'],
});
app.use(errorHandler(error404));
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
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
    } catch (error: any) {
      console.log(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`app started at ${PORT}`);
  });
}

export { app };
