import { Request, Response, Router } from "express";
import { sendError, validateSchema } from "@utils/error";
import { registerValidation, totpSetup, verificationValidation } from "./validations/account";
import { createAccount, generateAvatarUrl, updateTOTP, verifyAccount } from "@controller/account";
import { authenticate } from "@middlewares/auth";
import speakeasy from "speakeasy";

const app: Router = Router();

app.get("/me", authenticate, async (req: Request, res: Response) => {
    if (!req.user) return sendError(res, 400, 1091, "You are not authenticated.");

    if (!req.user.verified)
        return sendError(res, 400, 1093, "Your account is not verified. Check your mails to verify.");

    res.json({id: req.user._id, username: req.user.username, email: req.user.email,
        allowInvites: req.user.allowInvites, totpEnabled: req.user.totpEnabled, avatar: generateAvatarUrl(req.user.email)});
});

app.post("/register", async (req: Request, res: Response) => {
    if (process.env.DISABLE_SIGNUPS === "true")
        return sendError(res, 400, 1094, "Signups are disabled on this server.");

    if (validateSchema(res, registerValidation, req.body)) return;

    const account = await createAccount(req.body);
    if (account) return res.json(account);

    res.json({ message: "Your account has been successfully created. Check your mails to verify." });
});

app.post("/verify", async (req: Request, res: Response) => {
    if (validateSchema(res, verificationValidation, req.body)) return;

    const verified = await verifyAccount({ id: req.body.id, code: parseInt(req.body.code) });
    if (verified) return res.json(verified);

    res.json({ message: "Your account has been successfully verified." });
});

app.get("/totp/secret", authenticate, async (req: Request, res: Response) => {
    res.json({
        secret: req.user?.totpSecret,
        url: `otpauth://totp/LicenseAPI%20%28${req.user?.username}%29?secret=${req.user?.totpSecret}`,
    });
});

app.post("/totp/enable", authenticate, async (req: Request, res: Response) => {
    if (validateSchema(res, totpSetup, req.body)) return;

    const tokenCorrect = speakeasy.totp.verify({
        secret: req.user?.totpSecret || "", encoding: "base32",
        token: req.body.code,
    });

    if (!tokenCorrect) return sendError(res, 400, 1092, "Your provided code is invalid or has expired.");

    const enabledError = await updateTOTP(req.user?._id, true);
    if (enabledError) return res.json(enabledError);

    res.json({ message: "TOTP has been successfully enabled on your account." });
});

app.post("/totp/disable", authenticate, async (req: Request, res: Response) => {
    const enabledError = await updateTOTP(req.user?._id, false);
    if (enabledError) return res.json(enabledError);

    res.json({ message: "TOTP has been successfully disabled on your account." });
});

export default app;