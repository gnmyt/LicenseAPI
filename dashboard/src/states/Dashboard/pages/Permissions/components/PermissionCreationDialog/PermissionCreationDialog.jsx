import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Shield, Description} from "@mui/icons-material";

export const PermissionCreationDialog = ({open, onClose, fetchPermissions}) => {
    const {currentProject} = useContext(ProjectContext);

    const [permission, setPermission] = useState("");
    const [description, setDescription] = useState("");

    const [creationError, setCreationError] = useState("");

    const updatePermission = async (event) => {
        setCreationError("");
        setPermission(event.target.value);
    }

    const updateDescription = async (event) => {
        setCreationError("");
        setDescription(event.target.value);
    }

    const closeDialog = () => {
        onClose();

        setPermission("");
        setDescription("");
        setCreationError("");
    }

    const createPermission = async () => {
        try {
            await putRequest(`/permission/${currentProject.id}`, {permission, description});
            fetchPermissions();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const onKeyUp = (event) => {
        if (event.key === "Enter") createPermission();
    }

    return (
        <Dialog open={open} onClose={closeDialog} onKeyUp={onKeyUp}>
            <DialogTitle>Create permission</DialogTitle>
            <DialogContent sx={{maxWidth: 350}}>

                {creationError && <Alert severity="error" sx={{mb: 1}}>{creationError}</Alert>}

                <TextField variant="outlined" fullWidth placeholder="Permission (e.g. Project.View)"
                           label="Permission" sx={{mt: 1}}
                           value={permission} onChange={updatePermission}
                            InputProps={{startAdornment: <Shield sx={{color: 'text.secondary', mr: 1}}/>}}/>

                <TextField variant="outlined" fullWidth placeholder="Description" label="Description"
                           sx={{mt: 1}} value={description} onChange={updateDescription}
                             InputProps={{startAdornment: <Description sx={{color: 'text.secondary', mr: 1}}/>}}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={createPermission} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    )
}