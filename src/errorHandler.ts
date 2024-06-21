import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/ban-types
export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (e: any) {
      next(e);
    }
  };
};
