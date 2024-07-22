import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext, useState} from "react";
import {patchRequest} from "@/common/utils/RequestUtil.js";
import {default as PermissionDialog} from "@/states/Dashboard/pages/Licenses/components/LicenseDialog/pages/Permissions";

export const Permissions = () => {

    const {currentProject, updateProjects} = useContext(ProjectContext);

    const [open, setOpen] = useState(false);

    const [permissions, setPermissions] = useState(currentProject.defaults.permissions);

    const savePermissions = async () => {
        try {
            setOpen(false);
            await patchRequest(`/project/${currentProject.id}`, {defaults: {permissions}});
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
               justifyContent="space-between" gap={2} alignItems="center">
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Update default permissions</DialogTitle>
                <DialogContent sx={{width: 400, overflow: "hidden"}}>
                    <PermissionDialog permissions={permissions} setPermissions={setPermissions}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => savePermissions()} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Stack>
                <Typography variant="h5" fontWeight={700}>Permissions</Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {currentProject.defaults.permissions.length > 0 && <>Current permissions: {currentProject.defaults.permissions.join(", ")}</>}
                    {currentProject.defaults.permissions.length === 0 && <>No permissions selected</>}
                </Typography>
            </Stack>
            <Button variant="contained" onClick={() => setOpen(true)}>Edit</Button>
        </Stack>
    )
}