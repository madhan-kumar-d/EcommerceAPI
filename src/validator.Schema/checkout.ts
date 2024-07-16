import Joi from 'joi';

export const createCheckoutSchema = Joi.object({
  cartId: Joi.array(),
  address: Joi.string().required(),
  pinCode: Joi.string().length(6).required(),
});

export const updateCheckoutStatusSchema = Joi.object({
  orderId: Joi.number().required(),
  status: Joi.string().required(),
});
