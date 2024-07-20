import Joi from "joi";

export const createPermissionValidation = Joi.object({
    permission: Joi.string().min(3).regex(/^[.a-zA-Z0-9]+$/).max(50).required(),
    description: Joi.string().min(3).max(100).required()
});

export const updatePermissionValidation = Joi.object({
    permission: Joi.string().min(3).regex(/^[.a-zA-Z0-9]+$/).max(50),
    description: Joi.string().min(3).max(100)
});