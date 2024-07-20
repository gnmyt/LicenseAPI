import {Divider, Menu, ListItemIcon, MenuItem, Typography, Avatar} from "@mui/material";
import {Logout} from "@mui/icons-material";
import {UserContext} from "@contexts/User";
import {useContext} from "react";

export const AccountMenu = ({open, setOpen}) => {

    const {user, logout} = useContext(UserContext);

    return (
        <Menu anchorEl={document.getElementById("menu")} open={open} onClose={() => setOpen(false)}>
            <MenuItem>
                <Typography variant="inherit">Hi, <Typography variant="span" fontWeight={600}>{user.username}</Typography></Typography>
                <Avatar src={user.avatar} alt={user.username} sx={{ml: 1, width: 24, height: 24}}/>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <Logout fontSize="small"/>
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    )
}