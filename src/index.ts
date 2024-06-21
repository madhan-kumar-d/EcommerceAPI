import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import secrets from './secrets';
import mainRouter from './routes';
import { errorMiddleware } from './middleware/errors';

const app: Express = express();
const { PORT } = secrets;

app.use(express.json());
app.use('/', mainRouter);

export const prismaClient = new PrismaClient({
  log: ['query', 'error'],
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`app started at ${PORT}`);
});
