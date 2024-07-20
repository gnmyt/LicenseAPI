import {Alert, Button, CircularProgress, Stack, TextField} from "@mui/material";
import {useContext, useState} from "react";
import {request} from "@/common/utils/RequestUtil.js";
import {UserContext} from "@contexts/User";

export const TotpForm = ({token}) => {

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const {updateSessionToken} = useContext(UserContext);

    const login = (event) => {
        event.preventDefault();

        setError(false);
        setLoading(true);

        setTimeout(async () => {
            try {
                const data = await request("/auth/verify", "POST", {token, code: parseInt(code)});
                if (data.code) throw new Error("Invalid code");

                updateSessionToken(token);
            } catch (e) {
                setLoading(false);
                setError(true);
            }
        }, 500);
    }

    return (
        <Stack gap={1.5} component="form" onSubmit={login} sx={{width: "20rem"}}>
            <Alert severity="info">Please enter the 2FA code from your authenticator app</Alert>
            {error && <Alert severity="error">Wrong 2FA code!</Alert>}

            <TextField label="Code" variant="outlined" type="number"
                          placeholder="Code" autoComplete="one-time-code" value={code}
                            onChange={(e) => setCode(e.target.value)}/>
            <Button variant="contained" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit"/> : "Login"}
            </Button>
        </Stack>
    )
}