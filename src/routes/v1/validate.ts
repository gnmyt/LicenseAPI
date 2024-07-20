import { Request, Response, Router } from "express";
import { validateLicense } from "@controller/validation";

const app: Router = Router();

app.get("/:licenseKey", async (req: Request, res: Response) => {
    const validationKey = req.header("X-Validation-Key");
    if (!validationKey) return res.status(400).json({ code: 1, message: "You need to provide a validation key" });

    res.json(await validateLicense(validationKey, req.params.licenseKey));
});

export default app;