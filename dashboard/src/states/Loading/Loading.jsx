import {LinearProgress, Stack, useTheme} from "@mui/material";
import DarkLogo from "@/common/assets/images/logo/dark.webp";
import LightLogo from "@/common/assets/images/logo/light.webp";

export const Loading = ({progress}) => {
    const theme = useTheme();
    const logo = theme.palette.mode === "dark" ? DarkLogo : LightLogo;

    return (
        <Stack justifyContent="center" alignItems="center" sx={{height: "100vh"}} gap={5}>
            <img src={logo} alt="Logo" style={{width: "25rem"}}/>
            <LinearProgress variant={progress ? "determinate" : "indeterminate"} sx={{width: "20rem"}}
                            value={progress}/>
        </Stack>
    )
}