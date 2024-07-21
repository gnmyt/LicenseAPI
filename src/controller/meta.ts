import { checkProjectAccess } from "@controller/projects";
import { IKeyRole } from "@models/AccessKey";
import { ILicenseMetaType, IMetaData, MetaData } from "@models/MetaData";
import { planLimits } from "../limits/plans";

export const isValidMetaType = (type: string, value: string) => {
    if (type === ILicenseMetaType.TEXT) return true;
    if (type === ILicenseMetaType.NUMBER) return !isNaN(Number(value));
    if (type === ILicenseMetaType.BOOLEAN) return value === "true" || value === "false";
    return false;
}

export const convertIdsToMetaData = async (projectId: string, publicAccess: boolean, meta: { [key: string]: string }) => {
    const metaItems = await MetaData.find({ projectId,
        ...(publicAccess && { public: true }), _id: { $in: Object.keys(meta) } });

    const result: { [key: string]: string } = {};
    metaItems.forEach(metaItem => {
        result[metaItem.name] = Object.keys(meta).includes(metaItem.id) ? meta[metaItem.id] : (metaItem.defaultValue || "");
    });

    return result;
}

export const listMetaData = async (userId: string, projectId: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const meta = await MetaData.find({ projectId: String(access._id) });

    return meta.map(meta => ({
        type: meta.type, name: meta.name, description: meta.description, defaultValue: meta.defaultValue,
        public: meta.public
    }));
};

export const getMetaData = async (userId: string, projectId: string, name: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const meta = await MetaData.findOne({ projectId: String(access._id), name: name });
    if (meta === null) return { code: 8002, message: "The provided meta item could not be found" };

    return {
        type: meta.type, name: meta.name, description: meta.description, defaultValue: meta.defaultValue,
        public: meta.public
    }
}

export const createMetaData = async (userId: string, projectId: string, config: IMetaData) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const count = await MetaData.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].META) return { code: 95, message: "You have exceeded the meta item limit" };

    const meta = await MetaData.findOne({ projectId: String(access._id), name: config.name });
    if (meta !== null) return { code: 8003, message: "The provided meta item name is already in use" };

    if (config.defaultValue) {
        if (!isValidMetaType(config.type, config.defaultValue)) return { code: 8004, message: "The provided default value is not valid for the provided type" };
    }

    await MetaData.create({ ...config, projectId });

    return {};
}

export const deleteMetaData = async (userId: string, projectId: string, name: string) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const meta = await MetaData.findOne({ projectId: String(access._id), name });
    if (meta === null) return { code: 8002, message: "The provided meta item could not be found" };

    await meta.deleteOne();
}

export const updateMetaData = async (userId: string, projectId: string, name: string, config: IMetaData) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const meta = await MetaData.findOne({ projectId: String(access._id), name });
    if (meta === null) return { code: 8002, message: "The provided meta item could not be found" };

    if (config.defaultValue) {
        if (!isValidMetaType(config.type || meta.type, config.defaultValue))
            return { code: 8004, message: "The provided default value is not valid for the provided type" };
    }

    await meta.updateOne(config);

    return {};
}