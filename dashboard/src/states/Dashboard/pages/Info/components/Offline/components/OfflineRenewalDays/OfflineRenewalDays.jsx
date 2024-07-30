import {IconButton, Stack, TextField, Typography} from "@mui/material";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext, useState} from "react";
import {patchRequest} from "@/common/utils/RequestUtil.js";
import {Save} from "@mui/icons-material";

export const OfflineRenewalDays = () => {

    const {currentProject, updateProjects} = useContext(ProjectContext);

    const [valueChanged, setValueChanged] = useState(false);
    const [renewalDays, setRenewalDays] = useState(currentProject.offlineRenewalDays || 0);

    const saveChanges = async () => {
        try {
            await patchRequest(`/project/${currentProject.id}`, {offlineRenewalDays: renewalDays});
            await updateProjects();
            setValueChanged(false);
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
               justifyContent="space-between" gap={2}>
            <Stack>
                <Typography variant="h5" fontWeight={700}>Offline renewal days</Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    The number of days an offline license can be used before it needs to be renewed.
                </Typography>
            </Stack>
            <TextField sx={{mt: 1, width: "7rem"}} variant="outlined" size="small" value={renewalDays} type="number"
                       onChange={(event) => {
                           setRenewalDays(parseInt(event.target.value));
                           setValueChanged(true);
                       }}
                       InputProps={valueChanged ? {endAdornment: <IconButton onClick={saveChanges}><Save/></IconButton>} : {}}/>
        </Stack>
    )
}