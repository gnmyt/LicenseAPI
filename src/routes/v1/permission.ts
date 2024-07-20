import { Request, Response, Router } from "express";
import {
    createPermission,
    deletePermission,
    getPermission,
    listPermissions,
    updatePermission,
} from "@controller/permission";
import { createPermissionValidation, updatePermissionValidation } from "./validations/permission";
import { sendError, validateSchema } from "@utils/error";

const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const permissions = await listPermissions(String(req.user?._id), req.params.projectId);
    if ("code" in permissions) return res.json(permissions);

    res.json(permissions);
});

app.get("/:projectId/:permission", async (req: Request, res: Response) => {
    const permission = await getPermission(String(req.user?._id), req.params.projectId, req.params.permission);
    if ("code" in permission) return res.json(permission);

    res.json(permission);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, createPermissionValidation, req.body)) return;

    const permission = await createPermission(String(req.user?._id), req.params.projectId, req.body);
    if ("code" in permission) return res.json(permission);

    res.json({ message: "Your permission has been successfully created" });
});

app.delete("/:projectId/:permission", async (req: Request, res: Response) => {
    const permissionError = await deletePermission(String(req.user?._id), req.params.projectId, req.params.permission);
    if (permissionError) return res.json(permissionError);

    res.json({ message: "The provided permission has been successfully deleted" });
});

app.patch("/:projectId/:permission", async (req: Request, res: Response) => {
    if (validateSchema(res, updatePermissionValidation, req.body)) return;

    if (Object.keys(req.body).length === 0)
        return sendError(res, 400, 4, "You need to provide at least one field to update");

    const permission = await updatePermission(String(req.user?._id), req.params.projectId, req.params.permission, req.body);
    if ("code" in permission) return res.json(permission);

    res.json({ message: "The provided permission has been successfully updated" });
});

export default app;