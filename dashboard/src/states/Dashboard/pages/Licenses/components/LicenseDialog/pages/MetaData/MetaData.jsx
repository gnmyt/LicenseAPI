import {
    CircularProgress,
    Stack, TextField, Switch,
    Typography
} from "@mui/material";
import {getRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Group, LooksOneRounded, TextFields, ToggleOn} from "@mui/icons-material";

export const MetaData = ({metaData, setMetaData}) => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);

    const [onlineMeta, setOnlineMeta] = useState([]);

    const updateLocal = (name, value) => {
        setMetaData({...metaData, [name]: value});
    }

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getRequest(`/meta/${currentProject.id}/list`);

                if (!data) return;

                setOnlineMeta(data);

                if (metaData === null || Object.keys(metaData).length === 0) {
                    setMetaData(data.reduce((acc, meta) => {
                        acc[meta.name] = meta.defaultValue;
                        return acc;
                    }, {}));
                }

                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }

        fetchGroups();
    }, []);

    return (
        <Stack maxHeight={400} sx={{overflowY: 'auto'}}>
            {onlineMeta.map((meta, index) => (
                <Stack key={index} direction="row" alignItems="center" justifyContent="space-between" gap={5}
                       sx={{borderBottom: 1, borderColor: 'divider', py: 1}}>
                    <Stack direction="row" gap={1} alignItems="center">
                        {meta.type === "BOOLEAN" && <ToggleOn sx={{color: 'text.secondary'}}/>}
                        {meta.type === "TEXT" && <TextFields sx={{color: 'text.secondary'}}/>}
                        {meta.type === "NUMBER" && <LooksOneRounded sx={{color: 'text.secondary'}}/>}
                        <Typography variant="h6">{meta.name}</Typography>
                    </Stack>

                    {meta.type === "BOOLEAN" && <Switch checked={metaData[meta.name] === "true"}
                                                        onChange={(e) => updateLocal(meta.name, String(e.target.checked))}/>}

                    {meta.type === "NUMBER" && <TextField size="small" value={metaData[meta.name] || ""}
                                 placeholder={meta.description} type="number"
                                                          onChange={(e) => updateLocal(meta.name, e.target.value)}/>}

                    {meta.type === "TEXT" && <TextField size="small" value={metaData[meta.name] || ""}
                               placeholder={meta.description}
                                                        onChange={(e) => updateLocal(meta.name, e.target.value)}/>}
                </Stack>
            ))}

            {onlineMeta.length === 0 && !loading && <Stack justifyContent="center" alignItems="center" sx={{mt: 2}}>
                <Typography variant="h6" color="text.secondary">No metadata found</Typography>
            </Stack>}

            {loading && <Stack justifyContent="center" alignItems="center" sx={{mt: 2}}>
                <CircularProgress/>
            </Stack>}
        </Stack>
    )
}