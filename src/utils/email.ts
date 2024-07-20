import { createTransport, SentMessageInfo } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import * as process from "process";

const transport = createTransport({
    host: process.env.MAIL_SERVER || "smtp.gmail.com",
    port: parseInt(process.env.MAIL_PORT || "587"),
    auth: {
        user: process.env.MAIL_USER || "noreply@licenseapi.de",
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = (options: Options, success?: (info: SentMessageInfo) => void, error?: (msg: Error) => void) => transport.sendMail({
    ...options, from: process.env.MAIL_USER || "noreply@licenseapi.de",
}, (err, info) => {
    if (err !== null && error) return error(err);

    if (success) success(info);
});