import Joi from "joi";

export const licenseCreationValidation = Joi.object({
    key: Joi.string().min(3).max(128),
    groups: Joi.array().items(Joi.string().min(3).max(128)),
    permissions: Joi.array().items(Joi.string().min(3).max(128)),
    meta: Joi.object(),
    maxUses: Joi.number().min(1).max(1000000),
    expirationDate: Joi.date().min("now").max("1-1-2100").iso().allow(0)
});