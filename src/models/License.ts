import {model, ObjectId, Schema} from "mongoose";

export interface ILicense {
    _id: ObjectId,
    projectId: ObjectId,
    key: string,
    groups?: string[],
    permissions?: string[],
    meta: { [key: string]: string },
    maxUses: number,
    currentUses: number,
    expirationDate?: Date
}

const LicenseSchema = new Schema<ILicense>({
    projectId: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    groups: [String],
    permissions: [String],
    meta: {
        type: Object,
        default: {}
    },
    maxUses: {
        type: Number,
        default: -1
    },
    currentUses: {
        type: Number,
        default: 0
    },
    expirationDate: {
        type: String,
        default: Date.now
    }
});

export const License = model<ILicense>("licenses", LicenseSchema);