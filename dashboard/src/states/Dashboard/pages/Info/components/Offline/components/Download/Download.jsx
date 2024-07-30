import {Button, Stack, Typography} from "@mui/material";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext} from "react";
import {getRequest} from "@/common/utils/RequestUtil.js";

export const Download = () => {

    const {currentProject} = useContext(ProjectContext);

    const download = async () => {
        getRequest(`/project/${currentProject.id}/public-key`).then(response => {
            const element = document.createElement("a");
            const file = new Blob([response.key], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = currentProject.name + "_key.pem";
            document.body.appendChild(element);
            element.click();
        });
    }

    return (
        <Stack sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, p: 2, width: "100%"}} direction="row"
               justifyContent="space-between" gap={2} alignItems="center">
            <Stack>
                <Typography variant="h5" fontWeight={700}>Download public key</Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Download the public key to use for offline license generation.
                </Typography>
            </Stack>
            <Button variant="contained" onClick={() => download()}>Download</Button>
        </Stack>
    )
}