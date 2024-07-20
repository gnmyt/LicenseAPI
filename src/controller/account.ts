import { Account } from "@models/Account";
import { genSalt, hash } from "bcrypt";
import { sendMail } from "@utils/email";
import { ObjectId, Types } from "mongoose";
import {Md5} from "ts-md5";

export const generateAvatarUrl = (email: string) => {
    const hash = Md5.hashStr(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=mp`;
}

export const sendVerificationEmail = async (email: string, code: number, id: string) => {
    sendMail({
        to: email,
        subject: "LicenseAPI verification code",
        html: `<p>Your verification code: <b>${code}</b></p><p>Verify here: <a href="https://dash.licenseapi.de/verify/${id}/${code}">https://dash.licenseapi.de/verify/${id}/${code}</a></p>`,
        text: `Your verification code: ${code}\nVerify here: https://dash.licenseapi.de/verify/${id}/${code}`
    });
};

export const createAccount = async (configuration: { username: string, email: string, password: string }) => {
    const account = await Account.findOne().or([{ username: configuration.username }, {
        email: configuration.email,
        verified: true,
    }]);

    if (account !== null) return { code: 1001, message: "This account already exists" };

    // Hash the password
    const salt = await genSalt(10);
    const password = await hash(configuration.password, salt);

    // Create the account
    const created = await Account.create({ ...configuration, password });

    // Send the email
    await sendVerificationEmail(configuration.email, created.verificationSecret || 0, created._id.toString());
};

export const verifyAccount = async (configuration: { id: string, code: number }) => {
    if (!Types.ObjectId.isValid(configuration.id)) return { code: 3, message: "Invalid object id provided" };

    const account = await Account.findById(configuration.id);

    if (account === null) return { code: 1002, message: "The provided account does not exist" };

    if (account.verified) return { code: 1003, message: "The provided account is already verified" };

    if (account.verificationSecret !== configuration.code) return {
        code: 1003,
        message: "The provided verification secret is wrong",
    };

    await Account.findByIdAndUpdate(configuration.id, { verified: true, $unset: { verificationSecret: 1 } });
};

export const updateTOTP = async (id: ObjectId | undefined, status: boolean) => {
    const account = await Account.findById(id);

    if (account === null) return { code: 1002, message: "The provided account does not exist" };

    if (account.totpEnabled === status) return {
        code: 1009,
        message: `TOTP is already ${status ? "enabled" : "disabled"} on your account`,
    };

    await Account.findByIdAndUpdate(id, { totpEnabled: status });
};

export const getSimpleAccountObjectById = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) return { code: 3, message: "Invalid object id provided" };

    const account = await Account.findById(id);
    if (account === null) return {};

    return {id: account._id, username: account.username, email: account.email};
}