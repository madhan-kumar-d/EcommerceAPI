import Joi from 'joi';

export const createCheckoutSchema = Joi.object({
  cartId: Joi.array(),
  address: Joi.string().required(),
  pinCode: Joi.string().length(6).required(),
});

export const updateCheckoutStatusSchema = Joi.object({
  status: Joi.string().required(),
});

export const updateCheckoutStatusQuerySchema = Joi.object({
  id: Joi.number().required(),
});
