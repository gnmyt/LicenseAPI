import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Description, Group} from "@mui/icons-material";

export const GroupCreationDialog = ({open, onClose, fetchGroups}) => {
    const {currentProject} = useContext(ProjectContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [creationError, setCreationError] = useState("");

    const updateName = async (event) => {
        setCreationError("");
        setName(event.target.value);
    }

    const updateDescription = async (event) => {
        setCreationError("");
        setDescription(event.target.value);
    }

    const closeDialog = () => {
        onClose();

        setDescription("");
        setCreationError("");
    }

    const createGroup = async () => {
        try {
            await putRequest(`/group/${currentProject.id}`, {name, description});
            fetchGroups();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const onKeyUp = (event) => {
        if (event.key === "Enter") createGroup();
    }

    return (
        <Dialog open={open} onClose={closeDialog} onKeyUp={onKeyUp}>
            <DialogTitle>Create group</DialogTitle>
            <DialogContent sx={{maxWidth: 350}}>

                {creationError && <Alert severity="error" sx={{mb: 1}}>{creationError}</Alert>}

                <TextField variant="outlined" fullWidth placeholder="Name"
                           label="Name" sx={{mt: 1}}
                           value={name} onChange={updateName}
                            InputProps={{startAdornment: <Group sx={{color: 'text.secondary', mr: 1}}/>}}/>

                <TextField variant="outlined" fullWidth placeholder="Description" label="Description"
                           sx={{mt: 1}} value={description} onChange={updateDescription}
                             InputProps={{startAdornment: <Description sx={{color: 'text.secondary', mr: 1}}/>}}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={createGroup} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    )
}