import {useContext, useEffect, useState} from "react";
import {deleteRequest, getRequest, patchRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, Chip, CircularProgress, IconButton, Link, Stack, Typography} from "@mui/material";
import {Delete, Group} from "@mui/icons-material";
import GroupCreationDialog from "@/states/Dashboard/pages/Groups/components/GroupCreationDialog";
import GroupPermissionDialog from "@/states/Dashboard/pages/Groups/components/GroupPermissionDialog";

export const Groups = () => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () => {
        try {
            const data = await getRequest(`/group/${currentProject.id}/list`);

            if (!data) return;

            setGroups(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const deleteGroup = async (group) => {
        try {
            await deleteRequest(`/group/${currentProject.id}/${group}`);
            await fetchGroups();
        } catch (e) {
            console.error(e);
        }
    }

    const removeFromGroup = async (group, permission) => {
        try {
            const newPermissions = group.permissions.filter(p => p !== permission);
            await patchRequest(`/group/${currentProject.id}/${group.name}`, {permissions: newPermissions});
            await fetchGroups();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchGroups();

        const timer = setInterval(fetchGroups, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Stack>
            <GroupCreationDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                                    fetchGroups={fetchGroups}/>
            <GroupPermissionDialog group={selectedGroup} onClose={() => setSelectedGroup(null)}
                                    fetchGroups={fetchGroups} />

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    {loading && <>Groups</>}
                    {!loading && <>{groups.length} Groups</>}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Create
                    group</Button>
            </Stack>

            <Stack direction="row" gap={2} sx={{mt: 2, mx: 5}} flexWrap="wrap">
                {groups.map((group, index) => (
                    <Stack key={index} direction="row" justifyContent="space-between" width={{xs: "100%", lg: "49%"}}
                           sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 2}}>
                        <Stack sx={{flexGrow: 1}}>
                            <Stack direction="row" gap={1} alignItems="center">
                                <Group color="primary"/>
                                <Typography variant="h5" fontWeight={600}>{group.name}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{group.description}</Typography>
                            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" sx={{mt: 1}}>
                                {group.permissions.map((permission, index) => (
                                    <Chip key={index} label={permission} onDelete={() => removeFromGroup(group, permission)}/>
                                ))}
                                <Chip color="primary" label="+" onClick={() => setSelectedGroup(group)}/>
                            </Stack>
                        </Stack>

                        <Stack justifyContent="flex-end" direction="row" alignItems="center">
                            <IconButton color="primary" onClick={() => deleteGroup(group.name)}><Delete/></IconButton>
                        </Stack>
                    </Stack>
                ))}

                {loading && <Stack justifyContent="center" alignItems="center" sx={{width: "100%"}}>
                    <CircularProgress color="primary"/>
                </Stack>}

                {!loading && groups.length === 0 && <Stack justifyContent="center" alignItems="center"
                                                           sx={{width: "100%"}}>
                    <Typography variant="h5" color="text.secondary">
                        No groups created. <Link onClick={() => setDialogOpen(true)} color="primary"
                                                 sx={{cursor: "pointer"}}>Create one</Link>
                    </Typography>
                </Stack>}
            </Stack>
        </Stack>
    );
}