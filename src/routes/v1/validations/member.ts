import Joi from "joi";
import { IKeyRole } from "@models/AccessKey";

export const inviteMemberValidation = Joi.object({
    user: Joi.string().min(3).max(500).required(),
    role: Joi.number().valid(IKeyRole.VIEW, IKeyRole.MANAGE, IKeyRole.ADMIN)
});

export const patchMemberRoleValidation = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    role: Joi.number().valid(IKeyRole.VIEW, IKeyRole.MANAGE, IKeyRole.ADMIN).required()
});