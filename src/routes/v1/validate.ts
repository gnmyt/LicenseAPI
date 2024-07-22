import { Request, Response, Router } from "express";
import { validateLicense, signOfflineKey } from "@controller/validation";

const app: Router = Router();

app.get("/:licenseKey", async (req: Request, res: Response) => {
    const validationKey = req.header("X-Validation-Key");
    if (!validationKey) return res.status(400).json({ code: 1, message: "You need to provide a validation key" });

    res.json(await validateLicense(validationKey, req.params.licenseKey));
});

app.get("/:licenseKey/sign", async (req: Request, res: Response) => {
    const validationKey = req.header("X-Validation-Key");
    if (!validationKey) return res.status(400).json({ code: 1, message: "You need to provide a validation key" });

    const offlineKey = await signOfflineKey(validationKey, req.params.licenseKey);

    if (offlineKey.status !== "VALID") return res.json(offlineKey);

    res.header("Content-Type", "application/octet-stream")
        .header("Content-Disposition", `attachment; filename=${req.params.licenseKey}.lkey`)
        .send(offlineKey.file);

});

export default app;