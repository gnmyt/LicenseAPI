import {IconButton, Stack, TextField, Typography} from "@mui/material";
import {
    replaceLicenseDefaults
} from "@/states/Dashboard/pages/Licenses/components/LicenseDialog/pages/LicenseKey/util.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext, useState} from "react";
import {patchRequest} from "@/common/utils/RequestUtil.js";
import {Save} from "@mui/icons-material";

export const LicenseKey = () => {

    const {currentProject, updateProjects} = useContext(ProjectContext);

    const [keyChanged, setKeyChanged] = useState(false);
    const [licenseKey, setLicenseKey] = useState(currentProject.defaults.licenseKey);

    const saveLicenseKey = async () => {
        try {
            await patchRequest(`/project/${currentProject.id}`, {defaults: {licenseKey}});
            await updateProjects();
            setKeyChanged(false);
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
               justifyContent="space-between" gap={2}>
            <Stack>
                <Typography variant="h5" fontWeight={700}>License key</Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Example: {replaceLicenseDefaults(licenseKey)}
                </Typography>
            </Stack>
            <TextField sx={{mt: 1}} variant="outlined" size="small" value={licenseKey}
                       onChange={(event) => {
                           setLicenseKey(event.target.value);
                           setKeyChanged(true);
                       }}
                       InputProps={keyChanged ? {endAdornment: <IconButton onClick={saveLicenseKey}><Save/></IconButton>} : {}}/>
        </Stack>
    )
}