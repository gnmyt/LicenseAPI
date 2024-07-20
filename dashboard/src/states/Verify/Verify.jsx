import {Button, CircularProgress, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import ConfirmImage from "@/common/assets/images/confirm.svg";
import {useState} from "react";
import {postRequest} from "@/common/utils/RequestUtil.js";

export const Verify = () => {
    const userId = location.pathname.split("/")[2];
    const code = location.pathname.split("/")[3];

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const verify = () => {
        setLoading(true);

        setTimeout(async () => {
            try {
                await postRequest("/user/verify", {id: userId, code});
                setSuccess(true);
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        }, 1000);
    }

    return (
        <Stack justifyContent="space-evenly" alignItems="center" sx={{height: "100vh"}} direction={{xs: "column", lg: "row"}}>
            {success && <Stack justifyContent="center" gap={2} maxWidth="45rem">
                <Typography variant="h3" fontWeight="bold">Account verified successfully</Typography>
                <Typography variant="h5">You can now login to your account.</Typography>

                <Stack direction="row">
                    <Button variant="contained" color="primary" href="/" size="large">
                        Back to Homepage
                    </Button>
                </Stack>
            </Stack>}
            {!success && (userId && code) && <Stack justifyContent="center" gap={2} maxWidth="43rem">
                <Typography variant="h3" fontWeight="bold">Account verification</Typography>

                {!error && <Typography variant="h5">Please click the button below to verify your account.</Typography>}
                {error && <Typography variant="h5">Either the verification link is invalid or your account has already been verified.</Typography>}

                {!error && <Stack direction="row">
                    <Button variant="contained" color="primary" onClick={verify} size="large" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : "Verify account"}
                    </Button>
                </Stack>}
                {error && <Stack direction="row">
                    <Button variant="contained" color="primary" href="/" size="large">
                        Back to Homepage
                    </Button>
                </Stack>}

            </Stack>}
            {!success && (!userId || !code) && <Stack justifyContent="center" gap={2} maxWidth="45rem">
                <Typography variant="h3" fontWeight="bold">Invalid verification link</Typography>
                <Typography variant="h5">Please make sure you have clicked the correct link.</Typography>

                <Stack direction="row">
                    <Button variant="contained" color="primary" href="/" size="large">
                        Back to Homepage
                    </Button>
                </Stack>
            </Stack>}
            {!isMobile && <img src={ConfirmImage} alt="Confirm" height="350px"/>}
        </Stack>
    );
}