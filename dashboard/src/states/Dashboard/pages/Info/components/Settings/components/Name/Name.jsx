import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import {CopyAll, Save} from "@mui/icons-material";
import {useContext, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {patchRequest} from "@/common/utils/RequestUtil.js";

export const Name = () => {
    const {currentProject, updateProjects} = useContext(ProjectContext);

    const [name, setName] = useState(currentProject.name);
    const [nameChanged, setNameChanged] = useState(false);

    const updateName = (event) => {
        setName(event.target.value);
        setNameChanged(true);
    }

    const copyName = () => {
        navigator.clipboard.writeText(name);
    }

    const saveName = async () => {
        try {
            await patchRequest(`/project/${currentProject.id}`, {name});
            await updateProjects();
            setNameChanged(false);
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Box sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2.5, width: {xs: "100%", lg: "33%"}}}>
            <Typography variant="h5" fontWeight={700}>Project name</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                This is the project name. You will find it all over the dashboard and it will help you to identify your project
            </Typography>

            <TextField sx={{mt: 1.5}} variant="outlined" fullWidth value={name} onChange={updateName} size="small"
                       InputProps={nameChanged ? {endAdornment: <IconButton onClick={saveName}><Save/></IconButton>} : {}}/>

            <Button variant="contained" color="primary" startIcon={<CopyAll/>} sx={{mt: 1.5}}
                    onClick={copyName}>Copy</Button>
        </Box>
    )
}