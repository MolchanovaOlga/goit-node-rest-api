import Joi from "joi";

export const registerLoginSchema = Joi.object({
  password: Joi.string().required().min(8).messages({
    "any.required": "Password is required",
    "string.min": "Must be min 8 characters",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.pattern.base": "Must be a valid email",
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.pattern.base": "Must be a valid email",
  }),
});
