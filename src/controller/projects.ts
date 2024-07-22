import {IMemberProject, IProject, Project} from "@models/Project";
import {Types} from "mongoose";
import crypto from "crypto";
import {AccessKey, IKeyRole} from "@models/AccessKey";
import {Member} from "@models/Member";
import {License} from "@models/License";
import {Permission} from "@models/Permission";
import {Group} from "@models/Group";
import {MetaData} from "@models/MetaData";
import {generateKeyPair} from "node:crypto";

export const checkProjectAccess = (requiredPermission: IKeyRole) => async (userId: string, projectId: string) => {
    if (!Types.ObjectId.isValid(projectId))
        return { code: 3, message: "Invalid object id provided" };

    let project = await Project.findOne({ _id: projectId, creatorId: userId });
    if (project !== null) return project;

    const projectMember = await Member.findOne({ memberId: userId || "", accepted: true });
    if (projectMember === null) return { code: 5009, message: "The provided project id does not exist" };

    project = await Project.findById(projectMember.projectId);
    if (project === null) return { code: 5009, message: "The provided project id does not exist" };

    if (projectMember.role === IKeyRole.ADMIN) return project;
    if (requiredPermission === IKeyRole.MANAGE && projectMember.role === IKeyRole.MANAGE) return project;
    if (requiredPermission === IKeyRole.VIEW && (projectMember.role === IKeyRole.VIEW || projectMember.role === IKeyRole.MANAGE)) return project;

    return { code: 5009, message: "The provided project id does not exist" };
};

const projectMapper = (project: IProject | IMemberProject) => {
    const baseProject = {id: project._id, name: project.name, validationKey: project.validationKey,
        defaults: project.defaults,};
    if ("role" in project) return { ...baseProject, role: project.role };

    return baseProject;
};

export const listProjects = async (userId?: string) => {
    const projects: Array<IProject | IMemberProject> = await Project.find({ creatorId: userId || "" });

    const memberProjects = await Member.find({ memberId: userId || "", accepted: true });
    for (const memberProject of memberProjects) {
        const foundProject = await Project.findById(memberProject.projectId);
        if (foundProject !== null) {
            projects.push({ ...foundProject.toObject(), role: memberProject.role });
        }
    }

    return projects.map(project => projectMapper(project));
};

export const getProject = async (projectId: string, userId: string) => {
    const project = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in project) return project;

    return projectMapper(project);
};

export const getProjectUnsafe = async (projectId: string): Promise<IProject | null> => {
    const project = await Project.findById(projectId);
    if (project === null) return null;

    return project;
}

export const createProject = (name: string, userId: string) => {
    return new Promise((resolve, reject) => generateKeyPair("rsa", {
            modulusLength: 4096, publicKeyEncoding: {type: "spki", format: "pem"},
            privateKeyEncoding: {type: "pkcs8", format: "pem"}
        }, async (err, publicKey, privateKey) => {
            if (err) return reject({code: 5000, message: "An error occurred while generating the key pair"});

            await Project.create({name, creatorId: userId, privateKey, publicKey});

            resolve(true);
        })
    );
};

export const deleteProject = async (id: string, userId: string) => {
    const project = await checkProjectAccess(IKeyRole.ADMIN)(userId, id);
    if ("code" in project) return project;

    License.deleteMany({ projectId: project.id });
    Permission.deleteMany({ projectId: project.id });
    Group.deleteMany({ projectId: project.id });
    MetaData.deleteMany({ projectId: project.id });
    AccessKey.deleteMany({ projectId: project.id });
    Member.deleteMany({ projectId: project.id });

    await project?.deleteOne();
};

export const patchProject = async (id: string, userId: string, config: {
    name: string, defaults: { licenseKey: string, groups: [], permissions: [], expirationDate: Date }
}) => {
    const project = await checkProjectAccess(IKeyRole.MANAGE)(userId, id);
    if ("code" in project) return project;

    await project.updateOne({ name: config.name, defaults: Object.assign(project.defaults, config.defaults) });
};

export const regenerateKey = async (id: string, userId: string) => {
    const project = await checkProjectAccess(IKeyRole.MANAGE)(userId, id);
    if ("code" in project) return project;

    await project.updateOne({ validationKey: crypto.randomBytes(24).toString("hex") });
};