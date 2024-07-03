import Joi from 'joi';

export const cartCreateSchema = Joi.object({
  productID: Joi.number().integer().required(),
  quantity: Joi.number().integer().required().min(1),
});

export const cartQuerySchema = Joi.object({
  id: Joi.number().required(),
});
export const cartUpdateSchema = Joi.object({
  quantity: Joi.number().required(),
});
