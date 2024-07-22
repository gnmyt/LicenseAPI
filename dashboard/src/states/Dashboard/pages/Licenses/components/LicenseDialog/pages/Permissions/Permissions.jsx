import {
    CircularProgress,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {getRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {AdminPanelSettings} from "@mui/icons-material";

export const Permissions = ({setPermissions, permissions}) => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);

    const [onlinePermissions, setOnlinePermissions] = useState([]);

    const updateLocal = (permission) => {
        setPermissions(prev => {
            if (prev.includes(permission)) {
                return prev.filter(p => p !== permission);
            } else {
                return [...prev, permission];
            }
        });
    }

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await getRequest(`/permission/${currentProject.id}/list`);

                if (!data) return;

                setOnlinePermissions(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }

        fetchPermissions();
    }, []);

    return (
        <Stack maxHeight={400} sx={{overflowY: 'auto'}}>
            {onlinePermissions.map(({permission}, index) => (
                <Stack key={index} direction="row" gap={1} alignItems="center" justifyContent="space-between"
                       sx={{borderBottom: 1, borderColor: 'divider', py: 1}}>
                    <Stack direction="row" gap={1} alignItems="center">
                        <AdminPanelSettings sx={{color: 'text.secondary'}}/>
                        <Typography variant="h6">{permission}</Typography>
                    </Stack>
                    <Switch checked={permissions.includes(permission)} onChange={() => updateLocal(permission)}/>
                </Stack>
            ))}

            {loading && <Stack justifyContent="center" alignItems="center" sx={{mt: 2}}>
                <CircularProgress/>
            </Stack>}
        </Stack>
    )
}