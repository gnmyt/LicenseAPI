import { Account } from "@models/Account";
import { compare } from "bcrypt";
import { Session } from "@models/Session";
import speakeasy from "speakeasy";

export const login = async (configuration: { username: string, password: string }, user: { ip: string, userAgent: string }) => {
    const account = await Account.findOne({ username: configuration.username });

    // Check if account exists
    if (account === null) return { code: 2001, message: "Username or password incorrect" };

    // Check if password is correct
    if (!await compare(configuration.password, account.password)) return {
        code: 2001,
        message: "Username or password incorrect",
    };

    // Create Session
    const session = await Session.create({
        userId: account._id, ip: user.ip, userAgent: user.userAgent,
        verified: !account.totpEnabled,
    });

    return { token: session.token, totpRequired: account.totpEnabled };
};

export const verifySession = async (configuration: { token: string, code: string }) => {
    const session = await Session.findOne({ token: configuration.token });
    if (session === null) return { code: 2002, message: "Your session token is invalid" };

    if (session.verified) return { code: 2012, message: "Your session already got verified" };

    const account = await Account.findById(session.userId);
    if (account === null) return { code: 2001, message: "Username or password incorrect" };

    const tokenCorrect = speakeasy.totp.verify({
        secret: account.totpSecret || "", encoding: "base32",
        token: configuration.code,
    });

    if (!tokenCorrect) return { code: 2011, message: "Your provided code is invalid or has expired." };

    await Session.findByIdAndUpdate(session._id, { verified: true });
};

export const logout = async (token: string) => {
    const session = await Session.findOne({ token });

    if (session === null) return { code: 2002, message: "Your session token is invalid" };

    await session.deleteOne();
};