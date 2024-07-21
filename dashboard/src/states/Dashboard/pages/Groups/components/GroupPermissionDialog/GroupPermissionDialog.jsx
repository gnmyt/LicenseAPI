import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {getRequest, patchRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {AdminPanelSettings} from "@mui/icons-material";

export const GroupPermissionDialog = ({group, onClose, fetchGroups}) => {
    const {currentProject} = useContext(ProjectContext);

    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const closeDialog = () => {
        onClose();

        setSelectedPermissions([]);
    }

    const updateGroupPermissions = async () => {
        try {
            await patchRequest(`/group/${currentProject.id}/${group.name}`, {permissions: selectedPermissions});
            fetchGroups();

            closeDialog();
        } catch (e) {
            console.error(e);
        }
    }

    const updateLocal = (permission) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permission)) {
                return prev.filter(p => p !== permission);
            } else {
                return [...prev, permission];
            }
        });
    }

    useEffect(() => {
        if (!group) return;

        setSelectedPermissions(group.permissions);
    }, [group]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await getRequest(`/permission/${currentProject.id}/list`);

                if (!data) return;

                setPermissions(data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchPermissions();
    }, []);

    return (
        <Dialog open={group !== null} onClose={closeDialog}>
            <DialogTitle>Update permissions</DialogTitle>
            <DialogContent sx={{maxHeight: 500, overflowY: 'auto'}}>
                {permissions.map(({permission}, index) => (
                    <Stack key={index} direction="row" gap={1} alignItems="center" justifyContent="space-between"
                           sx={{borderBottom: 1, borderColor: 'divider', py: 1}}>
                        <Stack direction="row" gap={1} alignItems="center">
                            <AdminPanelSettings sx={{color: 'text.secondary'}}/>
                            <Typography variant="h6">{permission}</Typography>
                        </Stack>
                        <Switch checked={selectedPermissions.includes(permission)} onChange={() => updateLocal(permission)}/>
                    </Stack>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={updateGroupPermissions} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    )
}