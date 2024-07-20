import { Request, Response, Router } from "express";
import { validateSchema } from "@utils/error";
import { loginValidation, tokenValidation, verificationValidation } from "./validations/auth";
import { login, logout, verifySession } from "@controller/auth";

const app: Router = Router();

app.post("/login", async (req: Request, res: Response) => {
    if (validateSchema(res, loginValidation, req.body)) return;

    const session = await login(req.body, { ip: req.ip, userAgent: req.header("User-Agent") || "None" });
    if (session?.code) return res.json(session);

    res.header("Authorization", session?.token).json({ ...session, message: "Your session got successfully created" });
});

app.post("/verify", async (req: Request, res: Response) => {
    if (validateSchema(res, verificationValidation, req.body)) return;

    const session = await verifySession(req.body);
    if (session) return res.json(session);

    res.json({ message: "Your session got verified" });
});

app.post("/logout", async (req: Request, res: Response) => {
    if (validateSchema(res, tokenValidation, req.body)) return;

    const session = await logout(req.body.token);
    if (session) return res.json(session);

    res.json({ message: "Your session got deleted successfully" });
});

export default app;