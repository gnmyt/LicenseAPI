import {model, ObjectId, Schema} from "mongoose";

export interface IGroup {
    projectId: ObjectId,
    name: string,
    description?: string,
    permissions: string[]
}

const GroupSchema = new Schema<IGroup>({
    projectId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description provided"
    },
    permissions: [String]
});

export const Group = model<IGroup>("groups", GroupSchema);