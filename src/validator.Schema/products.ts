import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  MRP: Joi.number().required(),
});

export const queryProductSchema = Joi.object({
  productID: Joi.number().required(),
});

export const searchSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  perPage: Joi.number(),
  page: Joi.number(),
});
