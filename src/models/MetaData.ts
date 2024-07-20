import { model, Schema } from "mongoose";

export enum ILicenseMetaType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN"
}

export interface IMetaData {
    projectId: string,
    type: ILicenseMetaType,
    name: string,
    description?: string,
    defaultValue?: string,
    public: boolean
}

const MetaDataSchema = new Schema<IMetaData>({
    projectId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    defaultValue: String,
    public: {
        type: Boolean,
        default: false
    }
});

export const MetaData = model<IMetaData>("meta", MetaDataSchema);