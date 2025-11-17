import { Request, Response } from 'express';
import { pageNotFound } from '../exceptions/notFound.js';

export const error404 = async (_req: Request, _res: Response) => {
  throw new pageNotFound('Unable to find the route you are looking for');
};
