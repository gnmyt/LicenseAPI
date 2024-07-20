import { checkProjectAccess } from "@controller/projects";
import { IKeyRole } from "@models/AccessKey";
import { Group, IGroup } from "@models/Group";
import { planLimits } from "../limits/plans";
import { Permission } from "@models/Permission";
import { convertIdsToPermissions } from "@controller/permission";

export const convertIdsToGroups = async (projectId: string, groups: string[]) => {
    return (await Group.find({ projectId, _id: { $in: groups } }))
        .map(group => group.name);
}

export const mapGroup = async (projectId: string, group: IGroup) => (
    { name: group.name, description: group.description, permissions: await convertIdsToPermissions(projectId, group.permissions) });

export const listGroups = async (userId: string, projectId: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const groups = await Group.find({ projectId: String(access._id) });

    return Promise.all(groups.map(group => mapGroup(projectId, group)));
};

export const getGroup = async (userId: string, projectId: string, groupName: string) => {
    const project = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in project) return project;

    const group = await Group.findOne({ projectId: String(project._id), name: groupName });
    if (group === null) return { code: 4009, message: "The provided group does not exist" };

    return mapGroup(projectId, group);
}

export const createGroup = async (userId: string, projectId: string, configuration: IGroup) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const count = await Group.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].GROUPS) return { code: 95, message: "You have exceeded the group limit" };

    const group = await Group.findOne({ projectId: String(access._id), name: configuration.name });
    if (group !== null) return { code: 4008, message: "The provided group name is already in use" };

    if (configuration.permissions) {
        const permissionsEncrypted = (configuration.permissions || []).map(permission => permission);
        configuration.permissions = (await Permission.find({ projectId: String(access._id),
            permission: { $in: permissionsEncrypted } })).map(permission => permission.id);
    }

    await Group.create({ ...configuration, projectId });

    return {};
}

export const deleteGroup = async (userId: string, projectId: string, groupName: string) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const group = await Group.findOne({ projectId: String(access._id), name: groupName });
    if (group === null) return { code: 4009, message: "The provided group does not exist" };

    await group.deleteOne();
}

export const updateGroup = async (userId: string, projectId: string, groupName: string, config: IGroup) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const group = await Group.findOne({ projectId: String(access._id), name: groupName });
    if (group === null) return { code: 4009, message: "The provided group does not exist" };

    if (config.name) {
        const newGroup = await Group.findOne({ projectId: String(access._id), name: config.name });
        if (newGroup !== null) return { code: 4008, message: "The provided group name is already in use" };
    }

    if (config.permissions) {
        const permissionsEncrypted = (config.permissions || []).map(permission => permission);
        config.permissions = (await Permission.find({ projectId: String(access._id),
            permission: { $in: permissionsEncrypted } })).map(permission => permission.id);
    }

    await group.updateOne(config);

    return {};
}