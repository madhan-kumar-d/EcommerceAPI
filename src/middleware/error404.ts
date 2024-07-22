import { Request, Response } from 'express';
import { pageNotFound } from '../exceptions/notFound';

export const error404 = async (_req: Request, res: Response) => {
  throw new pageNotFound('Unable to find the route you are looking for');
};
