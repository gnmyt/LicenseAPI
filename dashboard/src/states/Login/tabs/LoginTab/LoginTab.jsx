import {Alert, Button, CircularProgress, Stack} from "@mui/material";
import LoginFields from "@/states/Login/tabs/LoginTab/components/LoginFields";
import {useContext, useState} from "react";
import {request} from "@/common/utils/RequestUtil.js";
import {UserContext} from "@contexts/User";
import TotpForm from "@/states/Login/tabs/LoginTab/components/TotpForm";

export const LoginTab = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [totpInfo, setTotpInfo] = useState(null);

    const {updateSessionToken} = useContext(UserContext);

    const login = (event) => {
        event.preventDefault();

        setError(false);
        setLoading(true);

        setTimeout(async () => {
            try {
                const data = await request("/auth/login", "POST", {username, password});

                if (data.totpRequired) {
                    setTotpInfo(data.token);
                    return setLoading(false);
                }

                updateSessionToken(data.token);
            } catch (e) {
                setLoading(false);
                setError(true);
            }
        }, 500);
    }

    if (totpInfo) return <TotpForm token={totpInfo} />;

    return (
        <Stack gap={1.5} component="form" onSubmit={login}>

            {error && <Alert severity="error">Wrong username or password!</Alert>}

            <LoginFields username={username} setUsername={setUsername} password={password} setPassword={setPassword} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button variant="text">Forgot password?</Button>
                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit"/> : "Login"}
                </Button>
            </Stack>

        </Stack>
    )
}