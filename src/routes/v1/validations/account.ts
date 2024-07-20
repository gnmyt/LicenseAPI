import Joi from "joi";

export const registerValidation = Joi.object({
    username: Joi.string().min(3).max(15).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(50).required()
});

export const verificationValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    code: Joi.number().required()
});

export const totpSetup = Joi.object({
    code: Joi.number().integer().required()
});