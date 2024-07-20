import { Request, Response, Router } from "express";
import { createGroup, deleteGroup, getGroup, listGroups, updateGroup } from "@controller/group";
import { sendError, validateSchema } from "@utils/error";
import { createGroupValidation, updateGroupValidation } from "./validations/group";
const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const groups = await listGroups(String(req.user?._id), req.params.projectId);
    if ("code" in groups) return res.json(groups);

    res.json(groups);
});

app.get("/:projectId/:groupName", async (req: Request, res: Response) => {
    const group = await getGroup(String(req.user?._id), req.params.projectId, req.params.groupName);
    if ("code" in group) return res.json(group);

    res.json(group);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, createGroupValidation, req.body)) return;

    const group = await createGroup(String(req.user?._id), req.params.projectId, req.body);
    if ("code" in group) return res.json(group);

    res.json({ message: "Your group has been successfully created" });
});

app.delete("/:projectId/:groupName", async (req: Request, res: Response) => {
    const groupError = await deleteGroup(String(req.user?._id), req.params.projectId, req.params.groupName);
    if (groupError) return res.json(groupError);

    res.json({ message: "The provided group has been successfully deleted" });
});

app.patch("/:projectId/:groupName", async (req: Request, res: Response) => {
    if (validateSchema(res, updateGroupValidation, req.body)) return;

    if (Object.keys(req.body).length === 0)
        return sendError(res, 400, 4, "You need to provide at least one field to update");

    const group = await updateGroup(String(req.user?._id), req.params.projectId, req.params.groupName, req.body);
    if ("code" in group) return res.json(group);

    res.json({ message: "The provided group has been successfully updated" });
});

export default app;