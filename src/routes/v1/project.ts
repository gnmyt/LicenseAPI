import { Request, Response, Router } from "express";
import {
    createProject,
    deleteProject,
    getProject,
    listProjects,
    patchProject,
    regenerateKey,
} from "@controller/projects";
import { sendError, validateSchema } from "@utils/error";
import { patchProjectValidation, projectCreationValidation } from "./validations/project";
import {leaveProject} from "@controller/member";

const app: Router = Router();

app.get("/list", async (req: Request, res: Response) => {
    res.json(await listProjects(String(req.user?._id)));
});

app.get("/:id", async (req: Request, res: Response) => {
    const request = await getProject(req.params.id, String(req.user?._id));
    if ("code" in request) return res.json(request);

    res.json(request);
});

app.put("/", async (req: Request, res: Response) => {
    if (validateSchema(res, projectCreationValidation, req.body)) return;

    const creationError = await createProject(req.body.name, String(req.user?._id));
    if (creationError) return res.json(creationError);

    res.json({ message: "Your project has been successfully created" });
});

app.delete("/:id", async (req: Request, res: Response) => {
    const deletionError = await deleteProject(req.params.id, String(req.user?._id));
    if (deletionError) return res.json(deletionError);

    res.json({ message: "The project has been successfully deleted" });
});

app.post("/:id/leave", async (req: Request, res: Response) => {
    const leaveError = await leaveProject(String(req.user?._id), req.params.id);
    if (leaveError) return res.json(leaveError);

    res.json({ message: "You have successfully left the project" });
});

app.patch("/:id", async (req: Request, res: Response) => {
    if (validateSchema(res, patchProjectValidation, req.body)) return;

    if (Object.keys(req.body).length === 0)
        return sendError(res, 400, 4, "You need to provide at least one field to update");

    const patchError = await patchProject(req.params.id, String(req.user?._id), req.body);
    if (patchError) return res.json(patchError);

    res.json({ message: "The project has been successfully updated" });
});

app.post("/:id/regenerate", async (req: Request, res: Response) => {
    const tokenError = await regenerateKey(req.params.id, String(req.user?._id));
    if (tokenError) return res.json(tokenError);

    res.json({ message: "The validation key has been regenerated" });
});

export default app;