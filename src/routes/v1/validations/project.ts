import Joi from "joi";

export const projectCreationValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required()
});

export const patchProjectValidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(15),
    offlineRenewalDays: Joi.number().min(-1).max(365 * 10),
    defaults: Joi.object({
        licenseKey: Joi.string(),
        groups: Joi.array(),
        permissions: Joi.array(),
        expirationDate: Joi.date(),
        maxUses: Joi.number().min(-1).max(100000),
    })
});