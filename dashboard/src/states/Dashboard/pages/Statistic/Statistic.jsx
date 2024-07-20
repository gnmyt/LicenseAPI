import {Stack, Typography} from "@mui/material";
import Analytics from "@/common/assets/images/error/analytics.svg";

export const Statistic = () => {
    return (
        <Stack gap={2} mt={{xs: 2, lg: 20}} direction="row" alignItems="center" sx={{flexWrap: {xs: 'wrap', lg: 'nowrap'}}}
               justifyContent="space-evenly">
            <Stack direction="column" justifyContent="center" sx={{maxWidth: "35rem"}} gap={2}>
                <Typography variant="h2" fontWeight={700}>Coming soon</Typography>
                <Typography variant="h4" fontWeight={500}>Statistics are currently not available.</Typography>
                <Typography variant="h5" fontWeight={500}>
                    We are working hard to bring you the best experience possible. Stay tuned!
                </Typography>
            </Stack>
            <img src={Analytics} alt="Analytics" height={350}/>
        </Stack>
    )
}