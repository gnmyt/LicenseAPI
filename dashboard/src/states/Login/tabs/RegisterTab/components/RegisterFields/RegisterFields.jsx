import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Email, Key, Person, Visibility, VisibilityOff} from "@mui/icons-material";
import {useState} from "react";

export const RegisterFields = ({username, setUsername, email, setEmail, password, setPassword, fieldError}) => {
    const [passwordShown, setPasswordShown] = useState(false);

    return (
        <>
            <TextField label="Username" variant="outlined" sx={{width: "20rem"}} type="text"
                       placeholder="Username" autoComplete="username" value={username}
                       error={fieldError === "username"} onChange={(e) => setUsername(e.target.value)}
                       InputProps={{startAdornment: <InputAdornment position="start"><Person/></InputAdornment>}}/>

            <TextField label="E-Mail" variant="outlined" sx={{width: "20rem"}} type="email" placeholder="E-Mail"
                          autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            error={fieldError === "email"}
                            InputProps={{startAdornment: <InputAdornment position="start"><Email/></InputAdornment>}}/>

            <TextField label="Password" variant="outlined" sx={{width: "20rem"}} placeholder="Password"
                       InputProps={{
                           startAdornment: <InputAdornment position="start"><Key/></InputAdornment>,
                           endAdornment: <InputAdornment position="end"
                                                         onClick={() => setPasswordShown(!passwordShown)}>
                               <IconButton>{passwordShown ? <VisibilityOff/> : <Visibility/>}</IconButton>
                           </InputAdornment>
                       }} type={passwordShown ? "text" : "password"} autoComplete="new-password"
                       error={fieldError === "password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
        </>
    )
}