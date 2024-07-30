import {Stack} from "@mui/material";
import OfflineRenewalDays from "./components/OfflineRenewalDays";
import Download from "./components/Download";

export const Offline = () => {
    return (
        <>
            <Stack gap={1} mt={2} mb={2} direction="column" alignItems="flex-start">
                <Download />
                <OfflineRenewalDays />
            </Stack>
        </>
    );
}