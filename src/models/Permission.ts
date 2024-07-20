import {model, ObjectId, Schema} from "mongoose";

export interface IPermission {
    projectId: ObjectId,
    permission: string,
    description: string
}

const PermissionSchema = new Schema<IPermission>({
    projectId: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description provided"
    }
});

export const Permission = model<IPermission>("permissions", PermissionSchema);