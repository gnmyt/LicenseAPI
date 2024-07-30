import {Typography} from "@mui/material";
import Settings from "@/states/Dashboard/pages/Info/components/Settings";
import Defaults from "@/states/Dashboard/pages/Info/components/Defaults";
import Offline from "@/states/Dashboard/pages/Info/components/Offline";

export const Info = () => {

    return (
        <>
            <Typography variant="h5" fontWeight={600}>Project settings</Typography>

            <Settings />

            <Typography variant="h5" fontWeight={600}>Default values</Typography>

            <Defaults />

            <Typography variant="h5" fontWeight={600}>Offline licensing</Typography>

            <Offline />
        </>
    )
}