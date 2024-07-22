import {
    CircularProgress,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {getRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Group} from "@mui/icons-material";

export const Groups = ({setGroups, groups}) => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);

    const [onlineGroups, setOnlineGroups] = useState([]);

    const updateLocal = (group) => {
        setGroups(prev => {
            if (prev.includes(group)) {
                return prev.filter(p => p !== group);
            } else {
                return [...prev, group];
            }
        });
    }

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getRequest(`/group/${currentProject.id}/list`);

                if (!data) return;

                setOnlineGroups(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }

        fetchGroups();
    }, []);

    return (
        <Stack maxHeight={400} sx={{overflowY: 'auto'}}>
            {onlineGroups.map(({name}, index) => (
                <Stack key={index} direction="row" gap={1} alignItems="center" justifyContent="space-between"
                       sx={{borderBottom: 1, borderColor: 'divider', py: 1}}>
                    <Stack direction="row" gap={1} alignItems="center">
                        <Group sx={{color: 'text.secondary'}}/>
                        <Typography variant="h6">{name}</Typography>
                    </Stack>
                    <Switch checked={groups.includes(name)} onChange={() => updateLocal(name)}/>
                </Stack>
            ))}

            {loading && <Stack justifyContent="center" alignItems="center" sx={{mt: 2}}>
                <CircularProgress/>
            </Stack>}
        </Stack>
    )
}