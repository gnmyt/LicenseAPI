import { checkProjectAccess } from "@controller/projects";
import { IKeyRole } from "@models/AccessKey";
import { ILicense, License } from "@models/License";
import { planLimits } from "../limits/plans";
import { Permission } from "@models/Permission";
import { IProject } from "@models/Project";
import { Group } from "@models/Group";
import { MetaData } from "@models/MetaData";
import { convertIdsToPermissions } from "@controller/permission";
import { convertIdsToGroups } from "@controller/group";
import { convertIdsToMetaData, isValidMetaType } from "@controller/meta";

export const generateCharacter = () => {
    return String.fromCharCode(Math.random() < 0.5 ? Math.floor(Math.random() * 26) + 65 : Math.floor(Math.random() * 26) + 97);
}

export const generateSpecialCharacter = () => {
    const specialChars = "!@#$%^&*()_+-=[]{};':\",./<>?";
    return specialChars[Math.floor(Math.random() * specialChars.length)];
}

export const generateAlphaNumeric = () => {
    const alphanumericChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)];
}

export const generateRandom = () => {
    const allChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{};':\",./<>?";
    return allChars[Math.floor(Math.random() * allChars.length)];
}

export const replaceLicenseDefaults = (defaultKey: string) => {
    return defaultKey.replace(/N/g, () => String(Math.floor(Math.random() * 10)))
        .replace(/C/g, () => generateCharacter())
        .replace(/L/g, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
        .replace(/U/g, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65))
        .replace(/S/g, () => generateSpecialCharacter())
        .replace(/A/g, () => generateAlphaNumeric())
        .replace(/R/g, () => generateRandom());
}

export const checkLicenseConfiguration = async (access: IProject, config: ILicense) => {
    if (config.groups) {
        const groupsEncrypted = config.groups.map(group => group);
        config.groups = (await Group.find({ projectId: String(access._id),
            name: { $in: groupsEncrypted }})).map(group => group.id);
    }
    if (config.permissions) {
        const permissionsEncrypted = config.permissions.map(permission => permission);
        config.permissions = (await Permission.find({ projectId: String(access._id),
            permission: { $in: permissionsEncrypted }})).map(permission => permission.id);
    }
    if (config.meta) {
        const metaEncrypted = Object.keys(config.meta).map(meta => meta);
        const meta = (await MetaData.find({ projectId: String(access._id),
            name: { $in: metaEncrypted }}));

        const metaObj: { [key: string]: string } = {};
        meta.forEach(meta => {
            if (isValidMetaType(meta.type, config.meta[meta.name]))
                metaObj[meta.id] = config.meta[meta.name];
        });
        config.meta = metaObj;
    }
}

export const mapLicense = async (projectId: string, license: any, publicAccess: boolean) => {
    return {
        key: license.key, groups: await convertIdsToGroups(projectId, license.groups), permissions: await convertIdsToPermissions(projectId, license.permissions),
        meta: await convertIdsToMetaData(projectId, publicAccess, license.meta), maxUses: license.maxUses, currentUses: license.currentUses,
        expirationDate: license.expirationDate
    }
}

export const listLicensesPaginated = async (userId: string, projectId: string, page: number, limit: number) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const licenses = await License.find({ projectId: String(access._id) }).skip(page * limit).limit(limit);

    return {
        total: await License.countDocuments({ projectId: String(access._id) }),
        licenses: await Promise.all(licenses.map(license => mapLicense(projectId, license, false)))
    }
}

export const getLicense = async (userId: string, projectId: string, licenseKey: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const license = await License.findOne({ projectId: String(access._id), key: licenseKey });
    if (license === null) return { code: 4009, message: "The provided license key does not exist" };

    return mapLicense(projectId, license, false);
}

export const createLicense = async (userId: string, projectId: string, config: ILicense) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const count = await License.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].LICENSES) return { code: 95, message: "You have exceeded the license limit" };

    if (!config.key) config.key = replaceLicenseDefaults(access.defaults.licenseKey);
    if (!config.maxUses) config.maxUses = access.defaults.maxUses;
    if (!config.groups) config.groups = access.defaults.groups;
    if (!config.permissions) config.permissions = access.defaults.permissions;
    if (!config.expirationDate) config.expirationDate = access.defaults.expirationDate;

    const license = await License.findOne({ projectId: String(access._id), key: config.key });
    if (license !== null) return { code: 4008, message: "The provided license key is already in use" };

    await checkLicenseConfiguration(access, config);

    const created = (await License.create({ ...config, projectId }));

    return { key: created.key};
}

export const updateLicense = async (userId: string, projectId: string, licenseKey: string, config: ILicense) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const license = await License.findOne({ projectId: String(access._id), key: licenseKey });
    if (license === null) return { code: 4009, message: "The provided license key does not exist" };

    await checkLicenseConfiguration(access, config);

    await License.updateOne({ projectId: String(access._id), key: licenseKey }, config);

    return { };
}

export const deleteLicense = async (userId: string, projectId: string, licenseKey: string) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const license = await License.findOne({ projectId: String(access._id), key: licenseKey });
    if (license === null) return { code: 4009, message: "The provided license key does not exist" };

    await License.deleteOne({ projectId: String(access._id), key: licenseKey });

    return { };
}