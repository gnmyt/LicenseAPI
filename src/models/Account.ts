import {Schema, ObjectId, model} from "mongoose";
import speakeasy from "speakeasy";

export interface IAccount {
    _id: ObjectId,
    username: string,
    email: string,
    password: string,
    verified: boolean,
    verificationSecret: number | undefined,
    totpSecret?: string,
    totpEnabled: boolean,
    allowInvites: boolean
}

const AccountSchema = new Schema<IAccount>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    verificationSecret: {
        type: Number,
        default: () =>  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    },
    verified: {
        type: Boolean,
        default: false
    },
    totpSecret: {
        type: String,
        default: () => speakeasy.generateSecret({name: "LicenseAPI"}).base32
    },
    totpEnabled: {
        type: Boolean,
        default: false
    },
    allowInvites: {
        type: Boolean,
        default: true
    }
});

export const Account = model<IAccount>("accounts", AccountSchema);