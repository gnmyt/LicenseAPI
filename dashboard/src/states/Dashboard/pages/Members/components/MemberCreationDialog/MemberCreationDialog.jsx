import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel, MenuItem, OutlinedInput, Select,
    TextField
} from "@mui/material";
import {patchRequest, putRequest} from "@/common/utils/RequestUtil.js";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Mail} from "@mui/icons-material";

export const MemberCreationDialog = ({open, onClose, fetchMembers, editUser, setEditUser}) => {
    const {currentProject} = useContext(ProjectContext);

    const [mail, setMail] = useState("");
    const [role, setRole] = useState(0);

    const [creationError, setCreationError] = useState("");

    const updateMail = (event) => {
        setCreationError("");
        setMail(event.target.value);
    }

    const updateRole = (event) => {
        setCreationError("");
        setRole(event.target.value);
    }

    const closeDialog = () => {
        onClose();

        setMail("");
        setRole(0);
        setCreationError("");
        setEditUser(null);
    }

    const inviteMember = async () => {
        try {
            await putRequest(`/member/${currentProject.id}`, {user: mail, role});
            fetchMembers();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const editMember = async () => {
        try {
            await patchRequest(`/member/${currentProject.id}/role`, {userId: editUser.user.id, role});
            fetchMembers();

            closeDialog();
        } catch (e) {
            setCreationError(e.message);
        }
    }

    const onKeyUp = (event) => {
        if (event.key === "Enter") inviteMember();
    }

    useEffect(() => {
        if (editUser) {
            setRole(editUser.role);
        }
    }, [editUser]);

    return (
        <Dialog open={open} onClose={closeDialog} onKeyUp={onKeyUp}>
            <DialogTitle>{editUser ? "Edit" : "Invite"} member</DialogTitle>
            <DialogContent sx={{maxWidth: 350}}>

                {creationError && <Alert severity="error" sx={{mb: 1}}>{creationError}</Alert>}

                {!editUser && <TextField variant="outlined" fullWidth placeholder="E-Mail"
                           label="E-Mail" sx={{mt: 1}} type="email"
                           value={mail} onChange={updateMail}
                            InputProps={{startAdornment: <Mail sx={{color: 'text.secondary', mr: 1}}/>}}/>}

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
                <Button onClick={editUser ? editMember : inviteMember} color="primary">{editUser ? "Edit" : "Invite"}</Button>
            </DialogActions>
        </Dialog>
    )
}