import { Request, Response, Router } from "express";

const app: Router = Router();

app.get("/status", (req: Request, res: Response) => {
    res.json({ service: "LicenseAPI Backend", version: process.env.PROJECT_VERSION, status: "online" });
});

export default app;