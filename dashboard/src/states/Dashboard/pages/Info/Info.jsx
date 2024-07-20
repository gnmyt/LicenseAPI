import {Alert, Stack, TextField, Typography} from "@mui/material";
import {useContext} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import Settings from "@/states/Dashboard/pages/Info/components/Settings";

export const Info = () => {
    const {currentProject} = useContext(ProjectContext);

    return (
        <>
            <Typography variant="h5" fontWeight={600}>Project settings</Typography>

            <Settings />

            <Typography variant="h5" fontWeight={600}>Default values</Typography>

            <Stack gap={1} mt={2} mb={2} direction="column" alignItems="flex-start">
                <Alert severity="error" sx={{width: "100%"}}>
                    <Typography variant="body1" fontWeight={500}>
                        It is currently not possible to change the default values. This feature will be available in future
                        updates.
                    </Typography>
                </Alert>

                <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
                          justifyContent="space-between" gap={2}>
                    <Stack>
                        <Typography variant="h5" fontWeight={700}>License key</Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Example: 123A-4313-43121-017#
                        </Typography>
                    </Stack>
                    <TextField sx={{mt: 1}} variant="outlined" size="small" value={currentProject.defaults.licenseKey}/>
                </Stack>

            </Stack>
        </>
    )
}