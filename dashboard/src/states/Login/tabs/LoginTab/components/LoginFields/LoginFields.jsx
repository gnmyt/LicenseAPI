import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Key, Person, Visibility, VisibilityOff} from "@mui/icons-material";
import {useState} from "react";

export const LoginFields = ({username, setUsername, password, setPassword}) => {
    const [passwordShown, setPasswordShown] = useState(false);

    return (
        <>
            <TextField label="Username" variant="outlined" sx={{width: "20rem"}} type="text"
                       placeholder="Username" autoComplete="username" value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       InputProps={{startAdornment: <InputAdornment position="start"><Person/></InputAdornment>}}/>

            <TextField label="Password" variant="outlined" sx={{width: "20rem"}} placeholder="Password"
                       InputProps={{
                           startAdornment: <InputAdornment position="start"><Key/></InputAdornment>,
                           endAdornment: <InputAdornment position="end"
                                                         onClick={() => setPasswordShown(!passwordShown)}>
                               <IconButton>{passwordShown ? <VisibilityOff/> : <Visibility/>}</IconButton>
                           </InputAdornment>
                       }} type={passwordShown ? "text" : "password"} autoComplete="current-password"
                       value={password} onChange={(e) => setPassword(e.target.value)}/>
        </>
    )
}