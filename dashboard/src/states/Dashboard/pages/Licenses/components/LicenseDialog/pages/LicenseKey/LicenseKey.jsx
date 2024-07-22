import {Button, TextField, Typography} from "@mui/material";
import {Key} from "@mui/icons-material";
import {useContext} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {replaceLicenseDefaults} from "./util.js";

export const LicenseKey = ({licenseKey, setLicenseKey, goBack}) => {

    const {currentProject} = useContext(ProjectContext);

    const generateKey = () => {
        const key = replaceLicenseDefaults(currentProject.defaults.licenseKey);
        setLicenseKey(key);
        goBack();
    }

    return (
        <>
            <Typography variant="h5" fontWeight={700}>New key</Typography>
            <TextField variant="outlined" fullWidth size="small" value={licenseKey} onChange={(event) => setLicenseKey(event.target.value)}
                          InputProps={{startAdornment: <Key sx={{color: 'text.secondary', mr: 1}}/>}}/>
            <Button variant="outlined" color="primary" sx={{mt: 1}} onClick={generateKey}>
                Generate new key
            </Button>
        </>
    );
}