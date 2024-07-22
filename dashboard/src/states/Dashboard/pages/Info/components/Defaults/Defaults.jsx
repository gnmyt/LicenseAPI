import LicenseKey from "./components/LicenseKey";
import Groups from "./components/Groups";
import Permissions from "./components/Permissions";
import {Stack} from "@mui/material";

export const Defaults = () => {
    return (
        <Stack gap={1} mt={2} mb={2} direction="column" alignItems="flex-start">
            <LicenseKey />
            <Groups />
            <Permissions />
        </Stack>
    )
}