import Joi from "joi";
import { ILicenseMetaType } from "@models/MetaData";

export const createMetaValidation = Joi.object({
    type: Joi.string().valid(ILicenseMetaType.TEXT, ILicenseMetaType.NUMBER, ILicenseMetaType.BOOLEAN).required(),
    name: Joi.string().alphanum().max(50).required(),
    description: Joi.string().min(3).max(100).required(),
    defaultValue: Joi.string().max(50),
    public: Joi.boolean().default(false)
});

export const updateMetaValidation = Joi.object({
    name: Joi.string().alphanum().max(50),
    description: Joi.string().min(3).max(100),
    defaultValue: Joi.string().max(50),
    public: Joi.boolean().default(false)
});