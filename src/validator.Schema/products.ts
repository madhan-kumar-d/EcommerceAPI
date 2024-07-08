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
  name: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  perPage: Joi.number().min(1),
  page: Joi.number().min(1),
});
