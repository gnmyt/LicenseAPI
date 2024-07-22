import { Project } from "@models/Project";
import { License } from "@models/License";
import { mapLicense } from "@controller/license";
import { Group } from "@models/Group";
import { Permission } from "@models/Permission";
import {createSign} from "node:crypto";

enum ResponseStatus {
    VALID = "VALID",
    EXPIRED = "EXPIRED",
    INVALID = "INVALID",
    INVALID_KEY = "INVALID_KEY",
    MAX_USES_REACHED = "MAX_USES_REACHED"
}

export const validateLicense = async (validationKey: string, licenseKey: string) => {
    const project = await Project.findOne({ validationKey });
    if (project === null) return { status: ResponseStatus.INVALID_KEY, message: "The provided validation key is invalid" };

    const license = await License.findOne({ projectId: String(project.id), key: licenseKey });
    if (license === null) return { status: ResponseStatus.INVALID, message: "The provided license key is invalid" };

    if (license.expirationDate && license.expirationDate < new Date() && new Date(license.expirationDate).getTime() !== 0)
        return { status: ResponseStatus.EXPIRED, message: "The provided license key has expired" };

    if (license.maxUses && license.maxUses !== -1 && license.maxUses <= license.currentUses)
        return { status: ResponseStatus.MAX_USES_REACHED, message: "The provided license key has reached its maximum uses" };

    const licenseData = await mapLicense(String(project.id), license, true);

    if (license.groups) {
        const groups = await Group.find({ _id: { $in: license.groups }});

        for (const group of groups) {
            const permissions = await Permission.find({ _id: { $in: group.permissions }});
            licenseData.permissions.push(...permissions.map(permission => permission.permission));
        }
    }

    await License.updateOne({ _id: license.id }, { currentUses: license.currentUses + 1 });

    return { status: ResponseStatus.VALID, license: licenseData };
}

export const signOfflineKey = async (validationKey: string, licenseKey: string) => {
    const license = await validateLicense(validationKey, licenseKey);

    if (license.status !== ResponseStatus.VALID) return { status: license.status, message: license.message, file: null};

    const project = await Project.findOne({ validationKey });
    if (project === null) return { status: ResponseStatus.INVALID_KEY, message: "The provided validation key is invalid", file: null };

    const signer = createSign("RSA-SHA256");

    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 7); // TODO: Let the user choose the renewal date

    signer.update(JSON.stringify({...license.license, renewalDate}));

    const signature = signer.sign(project.privateKey, "hex");

    let content = JSON.stringify({signature, data: {...license.license, renewalDate}});
    content = Buffer.from(content).toString('base64').replace(/(.{64})/g, "$1\n");

    const file = `-----BEGIN LICENSE KEY-----\n${content}\n-----END LICENSE KEY-----`;

    return { status: ResponseStatus.VALID, file };
}