import { Request, Response, Router } from "express";
import { createKey, deleteKey, listKeys } from "@controller/key";
import { validateSchema } from "@utils/error";
import { keyCreationValidation } from "./validations/key";

const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const keys = await listKeys(String(req.user?._id), req.params.projectId);
    if ("code" in keys) return res.json(keys);

    res.json(keys);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, keyCreationValidation, req.body)) return;

    const key = await createKey(String(req.user?._id), req.params.projectId, req.body);
    if ("code" in key) return res.json(key);

    res.json({ message: "Your key has been successfully created", token: key.token });
});

app.delete("/:projectId/:keyId", async (req: Request, res: Response) => {
    const keyError = await deleteKey(String(req.user?._id), req.params.projectId, req.params.keyId);
    if (keyError) return res.json(keyError);

    res.json({message: "The provided key has been successfully deleted"});
});

export default app;