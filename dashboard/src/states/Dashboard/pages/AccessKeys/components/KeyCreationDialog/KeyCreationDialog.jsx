import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    InputLabel, MenuItem, OutlinedInput,
    Select,
    TextField
} from "@mui/material";
import {putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Key} from "@mui/icons-material";

export const KeyCreationDialog = ({open, onClose, fetchKeys, setCreatedKey}) => {
    const {currentProject} = useContext(ProjectContext);

    const [name, setName] = useState("");
    const [role, setRole] = useState(0);

    const [creationError, setCreationError] = useState("");

    const updateName = async (event) => {
        setCreationError("");
        setName(event.target.value);
    }

    const updateRole = async (event) => {
        setCreationError("");
        setRole(event.target.value);
    }

    const closeDialog = () => {
        onClose();

        setName("");
        setRole(0);
        setCreationError("");
    }

    const createKey = async () => {
        try {
            const {token} = await putRequest(`/key/${currentProject.id}`, {name, role});
            setCreatedKey(token);
            fetchKeys();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const onKeyUp = (event) => {
        if (event.key === "Enter") createKey();
    }

    return (
        <Dialog open={open} onClose={closeDialog} onKeyUp={onKeyUp}>
            <DialogTitle>Create access key</DialogTitle>
            <DialogContent sx={{maxWidth: 350}}>

                {creationError && <Alert severity="error" sx={{mb: 1}}>{creationError}</Alert>}

                <TextField variant="outlined" fullWidth placeholder="Name (e.g. Project key)"
                           label="Name" sx={{my: 1}}
                           value={name} onChange={updateName}
                            InputProps={{startAdornment: <Key sx={{color: 'text.secondary', mr: 1}}/>}}/>

                <FormControl fullWidth sx={{my: 1}}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select labelId="role-select-label" value={role} onChange={updateRole}
                            input={<OutlinedInput label="Role"/>}>
                        <MenuItem value={0}>Viewer</MenuItem>
                        <MenuItem value={1}>Manager</MenuItem>
                        <MenuItem value={2}>Admin</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={createKey} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    )
}