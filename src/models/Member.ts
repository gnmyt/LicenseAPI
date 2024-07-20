import {model, ObjectId, Schema} from "mongoose";
import { IKeyRole } from "@models/AccessKey";

export interface IMember {
    projectId: ObjectId,
    memberId: ObjectId,
    role: IKeyRole,
    accepted: boolean
}

const MemberSchema = new Schema<IMember>({
    projectId: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: IKeyRole,
        default: IKeyRole.MANAGE
    },
    accepted: {
        type: Boolean,
        default: false
    }
});

export const Member = model<IMember>("members", MemberSchema);