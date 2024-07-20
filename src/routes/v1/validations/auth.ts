import Joi from "joi";

export const loginValidation = Joi.object({
    username: Joi.string().min(3).max(15).alphanum().required(),
    password: Joi.string().min(5).max(50).required()
});

export const tokenValidation = Joi.object({
    token: Joi.string().hex().length(96).required()
});

export const verificationValidation = Joi.object({
    token: Joi.string().hex().length(96).required(),
    code: Joi.number().integer().required()
});