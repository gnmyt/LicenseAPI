import {useContext, useEffect, useState} from "react";
import {deleteRequest, getRequest, patchRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, Chip, CircularProgress, IconButton, Link, Stack, Typography} from "@mui/material";
import {Delete, TextFields, ToggleOn, LooksOneRounded, Edit} from "@mui/icons-material";
import PermissionCreationDialog from "./components/MetaCreationDialog";

export const MetaData = () => {
    const {currentProject} = useContext(ProjectContext);

    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [metaData, setMetaData] = useState([]);

    const fetchMetaData = async () => {
        try {
            const data = await getRequest(`/meta/${currentProject.id}/list`);

            if (!data) return;

            setMetaData(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const toggleVisibility = async (meta) => {
        try {
            await patchRequest(`/meta/${currentProject.id}/${meta.name}`, {
                public: !meta.public
            });
            await fetchMetaData();
        } catch (e) {
            console.error(e);
        }
    }

    const deleteMetaItem = async (meta) => {
        try {
            await deleteRequest(`/meta/${currentProject.id}/${meta}`);
            await fetchMetaData();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchMetaData();

        const timer = setInterval(fetchMetaData, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Stack>
            <PermissionCreationDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                                      fetchPermissions={fetchMetaData} editItem={editItem} setEditItem={setEditItem} />

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    {loading && <>Meta-Items</>}
                    {!loading && <>{metaData.length} Meta-Items</>}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Create
                    item</Button>
            </Stack>

            <Stack direction="row" gap={2} sx={{mt: 2, mx: 5}} alignItems="center" flexWrap="wrap">
                {metaData.map((meta, index) => (
                    <Stack key={index} direction="row" alignItems="center" justifyContent="space-between"
                           width={{xs: "100%", lg: "49%"}}
                           sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 2}}>
                        <Stack sx={{flexGrow: 1}}>
                            <Stack direction="row" gap={1} alignItems="center">
                                {meta.type === "BOOLEAN" && <ToggleOn/>}
                                {meta.type === "TEXT" && <TextFields/>}
                                {meta.type === "NUMBER" && <LooksOneRounded/>}
                                <Typography variant="h5" fontWeight={600}>{meta.name}</Typography>
                                <Chip label={meta.public ? "Public" : "Private"}
                                        color={meta.public ? "primary" : "default"}
                                        onClick={() => toggleVisibility(meta)}/>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {meta.description} <Typography variant="span" color="primary">{meta.defaultValue}</Typography>
                            </Typography>
                        </Stack>

                        <Stack justifyContent="flex-end" direction="row">
                            <IconButton color="primary"
                                        onClick={() => {
                                            setEditItem(meta);
                                            setDialogOpen(true);
                                        }}><Edit/></IconButton>
                            <IconButton color="primary"
                                        onClick={() => deleteMetaItem(meta.name)}><Delete/></IconButton>
                        </Stack>
                    </Stack>
                ))}

                {loading && <Stack justifyContent="center" alignItems="center" sx={{width: "100%"}}>
                    <CircularProgress color="primary"/>
                </Stack>}

                {!loading && metaData.length === 0 && <Stack justifyContent="center" alignItems="center"
                                                             sx={{width: "100%"}}>
                    <Typography variant="h5" color="text.secondary">
                        No meta data created. <Link onClick={() => setDialogOpen(true)} color="primary"
                                                    sx={{cursor: "pointer"}}>Create one</Link>
                    </Typography>
                </Stack>}
            </Stack>
        </Stack>
    );
}