import { Request, Response, Router } from "express";
import { createLicense, deleteLicense, getLicense, listLicensesPaginated, updateLicense } from "@controller/license";
import { sendError, validateSchema } from "@utils/error";
import { licenseCreationValidation } from "./validations/license";

const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 100;

    if (page < 0) return sendError(res, 400, 4, "The page number cannot be negative");
    if (limit < 1) return sendError(res, 400, 4, "The limit cannot be less than 1");

    const licenses = await listLicensesPaginated(String(req.user?._id), req.params.projectId, page, limit);
    if ("code" in licenses) return res.json(licenses);

    res.json(licenses);
});

app.get("/:projectId/:licenseKey", async (req: Request, res: Response) => {
    const license = await getLicense(String(req.user?._id), req.params.projectId, req.params.licenseKey);
    if ("code" in license) return res.json(license);

    res.json(license);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, licenseCreationValidation, req.body)) return;

    const license = await createLicense(String(req.user?._id), req.params.projectId, req.body);
    if ("code" in license) return res.json(license);

    res.json({ key: license.key, message: "License created successfully" });
});

app.patch("/:projectId/:licenseKey", async (req: Request, res: Response) => {
    if (validateSchema(res, licenseCreationValidation, req.body)) return;

    if (Object.keys(req.body).length === 0)
        return sendError(res, 400, 4, "You need to provide at least one field to update");

    const license = await updateLicense(String(req.user?._id), req.params.projectId, req.params.licenseKey, req.body);
    if ("code" in license) return res.json(license);

    res.json({ message: "License updated successfully" });
});

app.delete("/:projectId/:licenseKey", async (req: Request, res: Response) => {
    const license = await deleteLicense(String(req.user?._id), req.params.projectId, req.params.licenseKey);
    if ("code" in license) return res.json(license);

    res.json({ message: "License deleted successfully" });
});

export default app;