import { Request, Response, Router } from "express";
import { deleteMember, inviteMember, listMembers, updateMemberRole } from "@controller/member";
import { validateSchema } from "@utils/error";
import { inviteMemberValidation, patchMemberRoleValidation } from "./validations/member";

const app: Router = Router();

app.get("/:projectId/list", async (req: Request, res: Response) => {
    const members = await listMembers(String(req.user?._id), req.params.projectId)
    if ("code" in members) return res.json(members);

    res.json(members);
});

app.put("/:projectId", async (req: Request, res: Response) => {
    if (validateSchema(res, inviteMemberValidation, req.body)) return;

    const memberError = await inviteMember(String(req.user?._id), req.params.projectId, req.body);
    if (memberError) return res.json(memberError);

    res.json({ message: "You have successfully invited the provided member" });
});

app.patch("/:projectId/role", async (req: Request, res: Response) => {
    if (validateSchema(res, patchMemberRoleValidation, req.body)) return;

    const memberError = await updateMemberRole(String(req.user?._id), req.params.projectId, req.body);
    if (memberError) return res.json(memberError);

    res.json({ message: "The provided member role has been updated successfully" });
});

app.delete("/:projectId/:memberId", async (req: Request, res: Response) => {
    const memberError = await deleteMember(String(req.user?._id), req.params.projectId, { userId: req.params.memberId });
    if (memberError) return res.json(memberError);

    res.json({message: "The provided member has been deleted successfully"});
});

export default app;