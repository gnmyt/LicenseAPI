import { checkProjectAccess } from "@controller/projects";
import { IKeyRole } from "@models/AccessKey";
import { Permission } from "@models/Permission";
import { planLimits } from "../limits/plans";

export const convertIdsToPermissions = async (projectId: string, permissions: string[]) => {
    const permissionsDb = await Permission.find({ projectId: projectId, _id: { $in: permissions } });
    return permissionsDb.map(permission => (permission.permission));
}

export const listPermissions = async (userId: string, projectId: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const permissions = await Permission.find({ projectId: String(access._id) });

    return permissions.map(permission => ({permission: permission.permission, description: permission.description}));
}

export const getPermission = async (userId: string, projectId: string, permissionName: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const permission = await Permission.findOne({ projectId: String(access._id), permission: permissionName });
    if (permission === null) return { code: 4009, message: "The provided permission does not exist" };

    return { permission: permission.permission, description: permission.description };
}

export const createPermission = async (userId: string, projectId: string, configuration: { permission: string, description: string }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const permission = await Permission.findOne({ projectId: String(access._id), permission: configuration.permission });
    if (permission !== null) return { code: 4008, message: "The provided permission name is already in use" };

    const count = await Permission.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].PERMISSIONS) return { code: 95, message: "You have exceeded the permission limit" };

    await Permission.create({ ...configuration, projectId });

    return {};
}

export const deletePermission = async (userId: string, projectId: string, permissionName: string) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const count = await Permission.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].PERMISSIONS) return { code: 95, message: "You have exceeded the permission limit" };

    const permission = await Permission.findOne({ projectId: String(access._id), permission: permissionName });
    if (permission === null) return { code: 4009, message: "The provided permission does not exist" };

    await permission.deleteOne();
}

export const updatePermission = async (userId: string, projectId: string, permissionName: string, config: { permission?: string, description?: string }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const permission = await Permission.findOne({ projectId: String(access._id), permission: permissionName });
    if (permission === null) return { code: 4009, message: "The provided permission does not exist" };

    if (config.permission) {
        const newPermission = await Permission.findOne({ projectId: String(access._id), permission: config.permission });
        if (newPermission !== null) return { code: 4008, message: "The provided permission name is already in use" };
    }

    await permission.updateOne(config);

    return {};
}