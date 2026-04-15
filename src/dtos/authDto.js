import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required."
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('(?=.*[A-Z])'))
    .pattern(new RegExp('(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.pattern.base": "Password must contain at least one uppercase letter and one special character.",
      "any.required": "Password is required."
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
