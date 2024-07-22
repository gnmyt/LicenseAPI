import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from "@mui/material";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext, useState} from "react";
import {patchRequest} from "@/common/utils/RequestUtil.js";
import {default as GroupDialog} from "@/states/Dashboard/pages/Licenses/components/LicenseDialog/pages/Groups";

export const Groups = () => {

    const {currentProject, updateProjects} = useContext(ProjectContext);

    const [open, setOpen] = useState(false);

    const [groups, setGroups] = useState(currentProject.defaults.groups);

    const saveGroups = async () => {
        try {
            setOpen(false);
            await patchRequest(`/project/${currentProject.id}`, {defaults: {groups}});
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
               justifyContent="space-between" gap={2} alignItems="center">
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Update default groups</DialogTitle>
                <DialogContent sx={{width: 400, overflow: "hidden"}}>
                    <GroupDialog groups={groups} setGroups={setGroups}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => saveGroups()} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Stack>
                <Typography variant="h5" fontWeight={700}>Groups</Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    {currentProject.defaults.groups.length > 0 && <>Current groups: {currentProject.defaults.groups.join(", ")}</>}
                    {currentProject.defaults.groups.length === 0 && <>No groups selected</>}

                </Typography>
            </Stack>
            <Button variant="contained" onClick={() => setOpen(true)}>Edit</Button>
        </Stack>
    )
}