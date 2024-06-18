import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { InvalidInputsException } from '../exceptions/invalid-inputs';
import { errorCodes } from '../exceptions/root';

export const validator = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      next(
        new InvalidInputsException(
          'Invalid inputs',
          errorCodes.UNABLE_TO_PROCESS_INPUT_DATA,
          error.details.map((detail) => detail.message).join(', '),
        ),
      );
    } else {
      next();
    }
  };
};
