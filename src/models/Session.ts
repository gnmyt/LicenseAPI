import {model, ObjectId, Schema, Types} from "mongoose";
import crypto from "crypto";

export interface ISession {
    _id: ObjectId,
    userId: ObjectId,
    token: string,
    ip: string,
    userAgent: string,
    verified: boolean
}

const SessionSchema = new Schema<ISession>({
    userId: {
        type: Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        default: () => crypto.randomBytes(48).toString("hex")
    },
    ip: String,
    userAgent: String,
    verified: {
        type: Boolean,
        required: true
    }
});

export const Session = model<ISession>("sessions", SessionSchema);