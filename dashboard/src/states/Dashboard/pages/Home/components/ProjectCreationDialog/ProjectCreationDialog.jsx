import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import {putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {AutoMode, DriveFileRenameOutline} from "@mui/icons-material";

export const ProjectCreationDialog = ({open, onClose}) => {

    const {updateProjects} = useContext(ProjectContext);

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [creationError, setCreationError] = useState(null);

    const createProject = () => {
        if (name.length === 0) return setCreationError("Name cannot be empty.");
        setLoading(true);

        putRequest("/project", {name}).then(() => {
            setLoading(false);
            updateProjects();
            onClose();
        }).catch((e) => {
            setCreationError(e.message);
            setLoading(false);
        });
    }

    const onKeyUp = (e) => {
        if (e.key === "Enter") createProject();
    }

    useEffect(() => {
        setName("");
    }, [open]);

    useEffect(() => {
        setCreationError(null);
    }, [name]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogContent sx={{maxWidth: 300}}>
                {creationError && <Alert severity="error" sx={{mb: 2}}>{creationError}</Alert>}
                <TextField label="Name" variant="outlined" fullWidth value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Name"
                           InputProps={{startAdornment: <DriveFileRenameOutline sx={{mr: 1}} color="text.secondary"/>}}
                           onKeyUp={loading ? null : onKeyUp} sx={{mt: 1}}/>
            </DialogContent>
            <DialogActions>
                {loading && <Button disabled><AutoMode sx={{mr: 1}} color="text.secondary"/>Creating...</Button>}
                {!loading && <>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={createProject}>Create</Button>
                </>}
            </DialogActions>
        </Dialog>
    )
}