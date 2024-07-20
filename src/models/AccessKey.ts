import { model, ObjectId, Schema } from "mongoose";
import crypto from "crypto";

export enum IKeyRole {
    VIEW,
    MANAGE,
    ADMIN
}

export interface IAccessKey {
    projectId: ObjectId,
    name: string,
    role: IKeyRole,
    token: string
}

const AccessKeySchema = new Schema<IAccessKey>({
    projectId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "Default key",
    },
    role: {
        type: Number,
        default: IKeyRole.VIEW,
        enum: IKeyRole,
    },
    token: {
        type: String,
        default: crypto.randomBytes(64).toString("hex"),
    },
});

export const AccessKey = model<IAccessKey>("access_keys", AccessKeySchema);