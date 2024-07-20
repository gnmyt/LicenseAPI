import {Stack} from "@mui/material";
import Key from "@/states/Dashboard/pages/Info/components/Settings/components/Key";
import Name from "@/states/Dashboard/pages/Info/components/Settings/components/Name";
import Delete from "@/states/Dashboard/pages/Info/components/Settings/components/Delete";

export const Settings = () => {
    return (
        <Stack gap={1} mt={2} mb={2} direction="row" alignItems="flex-start" sx={{flexWrap: {xs: 'wrap', lg: 'nowrap'}}}>
            <Key />

            <Name />

            <Delete />
        </Stack>
    )
}