import { Request, Response, Router } from "express";
import { createMetaData, deleteMetaData, getMetaData, listMetaData, updateMetaData } from "@controller/meta";
import { validateSchema } from "@utils/error";
import { createMetaValidation, updateMetaValidation } from "./validations/meta";

const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const meta = await listMetaData(String(req.user?._id), req.params.projectId);
    if ("code" in meta) return res.json(meta);

    res.json(meta);
});

app.get("/:projectId/:metaName", async (req: Request, res: Response) => {
    const meta = await getMetaData(String(req.user?._id), req.params.projectId, req.params.metaName);
    if ("code" in meta) return res.json(meta);

    res.json(meta);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, createMetaValidation, req.body)) return;

    const meta = await createMetaData(String(req.user?._id), req.params.projectId, req.body);
    if ("code" in meta) return res.json(meta);

    res.json({ message: "Your meta item has been successfully created" });
});

app.delete("/:projectId/:metaName", async (req: Request, res: Response) => {
    const metaError = await deleteMetaData(String(req.user?._id), req.params.projectId, req.params.metaName);
    if (metaError) return res.json(metaError);

    res.json({ message: "The provided meta item has been successfully deleted" });
});

app.patch("/:projectId/:metaName", async (req: Request, res: Response) => {
    if (validateSchema(res, updateMetaValidation, req.body)) return;

    if (Object.keys(req.body).length === 0)
        return res.json({ code: 4, message: "You need to provide at least one field to update" });

    const meta = await updateMetaData(String(req.user?._id), req.params.projectId, req.params.metaName, req.body);
    if ("code" in meta) return res.json(meta);

    res.json({ message: "The provided meta item has been successfully updated" });
});

export default app;