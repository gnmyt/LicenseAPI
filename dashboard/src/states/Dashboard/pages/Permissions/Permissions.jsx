import {useContext, useEffect, useState} from "react";
import {deleteRequest, getRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, CircularProgress, IconButton, Link, Stack, Typography} from "@mui/material";
import {Delete, Shield, ChevronRight} from "@mui/icons-material";
import PermissionCreationDialog from "./components/PermissionCreationDialog";

export const Permissions = () => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [permissions, setPermissions] = useState([]);

    const fetchPermissions = async () => {
        try {
            const data = await getRequest(`/permission/${currentProject.id}/list`);

            if (!data) return;

            setPermissions(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const deletePermission = async (permission) => {
        try {
            await deleteRequest(`/permission/${currentProject.id}/${permission}`);
            await fetchPermissions();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchPermissions();

        const timer = setInterval(fetchPermissions, 5000);

        return () => clearInterval(timer);
    }, []);

    const getNameClean = (permission) => {
        const parts = permission.split('.');

        return parts.map((part, index) => (
            <Stack key={index} direction="row" gap={0.5} alignItems="center">
                <Typography variant="h5" fontWeight={500}>{part}</Typography>
                {index < parts.length - 1 && <ChevronRight/>}
            </Stack>
        ))
    }

    return (
        <Stack>
            <PermissionCreationDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                                      fetchPermissions={fetchPermissions}/>

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <Typography variant="h5" fontWeight={600}>{permissions.length} Permissions</Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Create
                    permission</Button>
            </Stack>

            <Stack direction="row" gap={2} sx={{mt: 2, mx: 5}} alignItems="center" flexWrap="wrap">
                {permissions.map((permission, index) => (
                    <Stack key={index} direction="row" alignItems="center" justifyContent="space-between"
                           width={{xs: "100%", lg: "49%"}}
                           sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 2}}>
                        <Stack sx={{flexGrow: 1}}>
                            <Stack direction="row" gap={1} alignItems="center">
                                <Shield color="primary"/>
                                <Stack direction="row" gap={0.5}>
                                    {getNameClean(permission.permission)}
                                </Stack>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{permission.description}</Typography>
                        </Stack>

                        <Stack justifyContent="flex-end" direction="row">
                            <IconButton color="primary"
                                        onClick={() => deletePermission(permission.permission)}><Delete/></IconButton>
                        </Stack>
                    </Stack>
                ))}

                {loading && <Stack justifyContent="center" alignItems="center">
                    <CircularProgress color="primary"/>
                </Stack>}

                {!loading && permissions.length === 0 && <Stack justifyContent="center" alignItems="center"
                                                                sx={{width: "100%"}}>
                    <Typography variant="h5" color="text.secondary">
                        No permissions created. <Link onClick={() => setDialogOpen(true)} color="primary"
                                                      sx={{cursor: "pointer"}}>Create one</Link>
                    </Typography>
                </Stack>}
            </Stack>
        </Stack>
    );
}