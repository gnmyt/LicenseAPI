import {Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import ServerDown from "@/common/assets/images/error/server_down.svg";

export const Error = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{height: "100vh"}} gap={5} p={3}>
            <Stack direction="column" justifyContent="center" sx={{width: "30rem"}} gap={2}>
                <Typography variant="h2" fontWeight={700}>Oh no..</Typography>
                <Typography variant="h4" fontWeight={500}>The backend is currently not reachable.</Typography>

                <Typography variant="h5" fontWeight={500}>
                    This page will reload automatically once the backend is reachable again.
                </Typography>
            </Stack>

            {!isMobile && <img src={ServerDown} alt="Server down" height={350}/>}
        </Stack>
    )
}