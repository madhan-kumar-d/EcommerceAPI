import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
    .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
    .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
    .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
    .required()
    .messages({
      'string.min': 'Password should contain at least 8 Character',
      'string.pattern.name': 'Password should contain at least one {#name}',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(new RegExp('^(?=.*[!@#$%^&*])'), 'Special Character')
    .pattern(new RegExp('^(?=.*[A-Z])'), 'Upper Case')
    .pattern(new RegExp('^(?=.*[a-z])'), 'Lower Case')
    .pattern(new RegExp('^(?=.*[0-9])'), 'Number')
    .required()
    .messages({
      'string.min': 'Password should contain at least 8 Character',
      'string.pattern.name': 'Password should contain at least one {#name}',
    }),
});
export const tokenSchema = Joi.object({
  token: Joi.string().required(),
});
