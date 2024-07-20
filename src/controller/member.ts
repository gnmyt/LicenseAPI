import { checkProjectAccess } from "@controller/projects";
import { IKeyRole } from "@models/AccessKey";
import { IMember, Member } from "@models/Member";
import { Account } from "@models/Account";
import { sendMail } from "@utils/email";
import { getSimpleAccountObjectById } from "@controller/account";
import { planLimits } from "../limits/plans";

export const sendInvitationMail = async (email: string, username: string, projectName: string) => {
    sendMail({
        to: email,
        subject: `Invitation for ${projectName} - LicenseAPI`,
        text: `Hi ${username}. You have been invited to join the project ${projectName} on LicenseAPI. Visit your License API dashboard to accept the invitation.`,
    });
};

export const mapMember = async (member: IMember) => {
    const user = await getSimpleAccountObjectById(String(member.memberId));

    return { user, role: member.role, accepted: member.accepted };
};

export const listMembers = async (userId: string, projectId: string) => {
    const access = await checkProjectAccess(IKeyRole.VIEW)(userId, projectId);
    if ("code" in access) return access;

    const members = await Member.find({ projectId: String(access._id) });

    return await Promise.all(members.map(member => mapMember(member)));
};

export const inviteMember = async (userId: string, projectId: string, configuration: { user: string, role: IKeyRole }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const account = await Account.findOne().or([{
        username: configuration.user,
        allowInvites: true,
    }, { email: configuration.user, verified: true, allowInvites: true }]);

    const count = await Member.countDocuments({ projectId: String(access._id) });
    if (count >= planLimits[access.plan].MEMBERS) return { code: 95, message: "You have exceeded the member limit" };

    if (account === null) return { code: 1002, message: "The provided account does not exist or disabled invites" };
    if (String(account._id) === userId) return { code: 1005, message: "You cannot invite yourself" };

    const member = await Member.findOne({
        projectId: String(access._id),
        memberId: String(account._id),
    });
    if (member !== null) return { code: 1006, message: "This member is already part of this project" };

    await Member.create({ memberId: account._id, role: configuration?.role, projectId: projectId });

    await sendInvitationMail(account.email, account.username, access.name);
};

export const updateMemberRole = async (userId: string, projectId: string, configuration: { userId: string, role: IKeyRole }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const member = await Member.findOne({
        projectId: String(access._id),
        memberId: String(configuration.userId),
    });
    if (member === null) return { code: 1002, message: "The provided member is not part of this project" };

    await member.updateOne({ role: configuration.role });
};

export const deleteMember = async (userId: string, projectId: string, configuration: { userId: string }) => {
    const access = await checkProjectAccess(IKeyRole.MANAGE)(userId, projectId);
    if ("code" in access) return access;

    const member = await Member.findOne({
        projectId: String(access._id),
        memberId: String(configuration.userId),
    });
    if (member === null) return { code: 1002, message: "The provided member is not part of this project" };

    await member.deleteOne();
};
