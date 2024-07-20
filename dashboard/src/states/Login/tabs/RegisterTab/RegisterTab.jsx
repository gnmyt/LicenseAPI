import {Alert, Button, CircularProgress, Stack, Typography} from "@mui/material";
import {useState} from "react";
import RegisterFields from "@/states/Login/tabs/RegisterTab/components/RegisterFields";
import {postRequest} from "@/common/utils/RequestUtil.js";
import Email from "@/common/assets/images/mail.svg";

export const RegisterTab = ({setShowTabs}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [fieldError, setFieldError] = useState("");

    const [alreadyRegistered, setAlreadyRegistered] = useState(false);

    const [accountCreated, setAccountCreated] = useState(false);

    const [loading, setLoading] = useState(false);

    const register = (event) => {
        event.preventDefault();

        if (username.length < 3) return setFieldError("username");
        if (email.length < 3) return setFieldError("email");
        if (password.length < 3) return setFieldError("password");

        setLoading(true);

        setTimeout(async () => {
            try {
                await postRequest("/user/register", {username, email, password});
                setFieldError("");
                setLoading(false);
                setShowTabs(false);
                setAccountCreated(true);
            } catch (e) {
                if (e.code === 1001) setAlreadyRegistered(true);

                setLoading(false);
                setFieldError(e.fieldName);
            }
        }, 500);
    }

    return (
        <>
            {!accountCreated && <Stack gap={1.5} component="form" onSubmit={register}>
                {fieldError && <Alert severity="error">Please fill out all fields.</Alert>}
                {alreadyRegistered && <Alert severity="error">This account is already registered.</Alert>}

                <RegisterFields username={username} setUsername={setUsername} email={email} setEmail={setEmail}
                                password={password} setPassword={setPassword} fieldError={fieldError} />

                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit"/> : "Registrieren"}
                </Button>

            </Stack>}
            {accountCreated && <Stack gap={1.5} alignItems="center" maxWidth="20rem" mt={3}>
                <img src={Email} alt="E-Mail" width="60%" />
                <Typography variant="h5" textAlign="center">
                    Please check your E-Mail!
                </Typography>
                <Typography variant="body1" textAlign="center">
                    We have sent you an E-Mail to verify your account.
                </Typography>
            </Stack>}
        </>
    )
}