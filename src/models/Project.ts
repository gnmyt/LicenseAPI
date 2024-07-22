import { model, ObjectId, Schema } from "mongoose";
import crypto from "crypto";

export interface IProjectDefaults {
    licenseKey: string,
    groups: string[],
    permissions: string[],
    expirationDate: Date,
    maxUses: number
}

export interface IProject {
    _id: ObjectId,
    name: string,
    creatorId: ObjectId,
    validationKey: string,
    defaults: IProjectDefaults
}

const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    creatorId: {
        type: String,
        required: true,
    },
    validationKey: {
        type: String,
        default: () => crypto.randomBytes(24).toString("hex")
    },
    defaults: {
        type: Object,
        default: { licenseKey: "NNUN-UUNN-UNUU-NUUN", groups: [], expirationDate: new Date(0), permissions: [], maxUses: -1 },
    }
});

export const Project = model<IProject>("projects", ProjectSchema);