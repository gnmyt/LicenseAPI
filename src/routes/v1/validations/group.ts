import Joi from "joi";

export const createGroupValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(50).required(),
    description: Joi.string().min(3).max(100).required(),
    permissions: Joi.array().items(Joi.string().regex(/^[.a-zA-Z0-9]+$/).min(3).max(50).required())
});

export const updateGroupValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(50),
    description: Joi.string().min(3).max(100),
    permissions: Joi.array().items(Joi.string().regex(/^[.a-zA-Z0-9]+$/).min(3).max(50).required())
        .empty(Joi.array().length(0))
});