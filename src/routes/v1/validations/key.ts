import Joi from "joi";
import { IKeyRole } from "@models/AccessKey";

export const keyCreationValidation = Joi.object({
    name: Joi.string().min(2).max(15).required(),
    role: Joi.number().valid(IKeyRole.VIEW, IKeyRole.MANAGE, IKeyRole.ADMIN)
});