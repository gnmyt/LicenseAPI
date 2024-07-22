import {Box, Button, Typography} from "@mui/material";
import {Delete as DeleteIcon, Logout} from "@mui/icons-material";
import {deleteRequest, postRequest} from "@/common/utils/RequestUtil.js";
import {useContext} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";

export const Delete = () => {
    const {currentProject, updateProjects} = useContext(ProjectContext);
    const deleteProject = async () => {
        try {
            await deleteRequest(`/project/${currentProject.id}`);
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }
    }

    const leaveProject = async () => {
        try {
            await postRequest(`/project/${currentProject.id}/leave`);
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Box sx={{border: 1.5, borderColor: 'red', borderRadius: 1.5, p: 2.5, width: {xs: "100%", lg: "33%"}}}>
            <Typography variant="h5" fontWeight={700}>{currentProject["role"] === undefined ? "Delete" : "Leave"} project</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                This action cannot be undone. I hope you know what you are doing.
            </Typography>

            {currentProject.role === undefined && <Button variant="contained" sx={{mt: 2}} color="error" startIcon={<DeleteIcon/>} onClick={deleteProject}>Delete</Button>}

            {currentProject.role !== undefined && <Button variant="contained" sx={{mt: 2}} color="error" startIcon={<Logout/>} onClick={leaveProject}>Leave</Button>}

        </Box>
    )
}