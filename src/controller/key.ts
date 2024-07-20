import { checkProjectAccess } from "@controller/projects";
import { AccessKey, IKeyRole } from "@models/AccessKey";
import { planLimits } from "../limits/plans";

export const listKeys = async (userId: string, projectId: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const keys = await AccessKey.find({ projectId: String(access._id) });

    return keys.map(key => ({ id: key._id, name: key.name, role: key.role }));
};

export const createKey = async (userId: string, projectId: string, configuration: { name: string, role: IKeyRole }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const count = await AccessKey.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].KEYS) return { code: 95, message: "You have exceeded the key limit" };

    const key = await AccessKey.create({ ...configuration, projectId });

    return { token: key.token };
};

export const deleteKey = async (userId: string, projectId: string, keyId: string) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const key = await AccessKey.findOne({ _id: keyId, projectId });
    if (key === null) return { code: 8002, message: "The provided key could not be found" };

    key.deleteOne();
};