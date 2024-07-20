import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {CopyAll, Refresh, Key as KeyIcon} from "@mui/icons-material";
import {useContext} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {postRequest} from "@/common/utils/RequestUtil.js";

export const Key = () => {
    const {currentProject, updateProjects} = useContext(ProjectContext);

    const copyKey = () => {
        navigator.clipboard.writeText(currentProject.validationKey);
    }

    const regenerateKey = async () => {
        try {
            await postRequest(`/project/${currentProject.id}/regenerate`);
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }

    }

    return (
        <Box sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2.5, width: {xs: "100%", lg: "33%"}}}>
            <Typography variant="h5" fontWeight={700}>Validation key</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Verification keys can be used for client-side projects. They are only used to confirm
                licenses and have no other special rights
            </Typography>
            <TextField sx={{mt: 1.5}} variant="outlined" fullWidth size="small"
                       value={currentProject.validationKey}
                       InputProps={{startAdornment: <KeyIcon sx={{color: 'text.secondary', mr: 1}}/>}}/>

            <Stack direction="row" sx={{mt: 1.5}} gap={1}>
                <Button variant="contained" color="primary" startIcon={<Refresh/>} onClick={regenerateKey}>Regenerate key</Button>
                <Button variant="contained" color="primary" startIcon={<CopyAll/>} onClick={copyKey}>Copy</Button>
            </Stack>
        </Box>
    )
}