import { Response } from "express";
import { ObjectSchema } from "joi";

const codeMappings: Record<string, number> = {
    "any.required": 1, // TODO
    "any": 0
};

export const sendError = (res: Response, httpCode: number, errorCode: number, message: string, fieldName?: string) =>
    res.status(httpCode).json({ code: errorCode, message, fieldName });

export const validateSchema = (res: Response, schema: ObjectSchema, object: Record<string, any>) => {
    const { error } = schema.validate(object, { errors: { wrap: { label: "" } } });
    const errorCode: number = codeMappings[error?.details[0].type || "any"] || 0;
    const message: string = error?.details[0].message || "No message provided";

    if (error) sendError(res, 400, errorCode, message, error?.details[0].context?.key);

    return error;
};