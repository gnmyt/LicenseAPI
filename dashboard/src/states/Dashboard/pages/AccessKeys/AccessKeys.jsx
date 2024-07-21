import {useContext, useEffect, useState} from "react";
import {deleteRequest, getRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Alert, Button, CircularProgress, IconButton, Link, Snackbar, Stack, Typography} from "@mui/material";
import {Delete, Key} from "@mui/icons-material";
import KeyCreationDialog from "./components/KeyCreationDialog";

export const AccessKeys = () => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [keys, setKeys] = useState([]);
    const [createdKey, setCreatedKey] = useState(null);

    const fetchKeys = async () => {
        try {
            const data = await getRequest(`/key/${currentProject.id}/list`);

            if (!data) return;

            setKeys(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const deleteKey = async (key) => {
        try {
            await deleteRequest(`/key/${currentProject.id}/${key}`);
            await fetchKeys();
        } catch (e) {
            console.error(e);
        }
    }

    const getKeyRole = (role) => {
        switch (role) {
            case 0:
                return "Can view project data like licenses, groups, ...";
            case 1:
                return "Can view, edit and delete project data like licenses, groups, ...";
            case 2:
                return "Can manage project data and access keys";
        }

        return "Unknown";
    }

    const copyAndClose = () => {
        navigator.clipboard.writeText(createdKey);
        setCreatedKey(null);
    }

    useEffect(() => {
        fetchKeys();

        const timer = setInterval(fetchKeys, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Stack>
            <KeyCreationDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                               fetchKeys={fetchKeys} setCreatedKey={setCreatedKey}/>
            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    {loading && <>Access keys</>}
                    {!loading && <>{keys.length} Access keys</>}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Create
                    key</Button>
            </Stack>

            <Snackbar open={createdKey !== null} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <Alert severity="success" sx={{width: "100%"}}
                          action={<Button color="inherit" size="small" onClick={copyAndClose}>Copy & Close</Button>}
                >Access key created</Alert>
                </Snackbar>

            <Stack direction="row" gap={2} sx={{mt: 2, mx: 5}} alignItems="center" flexWrap="wrap">
                {keys.map((key, index) => (
                    <Stack key={index} direction="row" alignItems="center" justifyContent="space-between"
                           width={{xs: "100%", lg: "49%"}}
                           sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 2}}>
                        <Stack sx={{flexGrow: 1}}>
                            <Stack direction="row" gap={1} alignItems="center">
                                <Key color="primary"/>
                                <Typography variant="h6">{key.name}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{getKeyRole(key.role)}</Typography>
                        </Stack>

                        <Stack justifyContent="flex-end" direction="row">
                            <IconButton color="primary"
                                        onClick={() => deleteKey(key.id)}><Delete/></IconButton>
                        </Stack>
                    </Stack>
                ))}

                {loading && <Stack justifyContent="center" alignItems="center" sx={{width: "100%"}}>
                    <CircularProgress color="primary"/>
                </Stack>}

                {!loading && keys.length === 0 && <Stack justifyContent="center" alignItems="center"
                                                         sx={{width: "100%"}}>
                    <Typography variant="h5" color="text.secondary">
                        No access keys created. <Link onClick={() => setDialogOpen(true)} color="primary"
                                                      sx={{cursor: "pointer"}}>Create one</Link>
                    </Typography>
                </Stack>}
            </Stack>
        </Stack>
    );
}