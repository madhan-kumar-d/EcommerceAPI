import express, { Express, Request, Response } from 'express';
import * as secrets from './secrets';
import mainRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errors';

const app: Express = express();
const PORT = secrets.PORT;

app.use(express.json());
app.use('/', mainRouter);

export const prismaClient = new PrismaClient({
  log: ['query', 'error'],
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`app started at ${PORT}`);
});
