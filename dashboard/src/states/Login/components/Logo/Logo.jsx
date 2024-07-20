import {Stack, Typography, useTheme} from "@mui/material";
import DarkLogo from "@/common/assets/images/logo/small-dark.webp";
import LightLogo from "@/common/assets/images/logo/small-light.webp";

export const Logo = () => {
    const theme = useTheme();
    const logo = theme.palette.mode === "dark" ? DarkLogo : LightLogo;

    return (
        <Stack direction="row" alignItems="center" gap={2}>
            <img src={logo} alt="Logo" style={{width: "3rem"}}/>
            <Typography variant="h4"><span style={{fontWeight: "bold"}}>License</span>API</Typography>
        </Stack>
    )
}