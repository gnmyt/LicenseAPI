import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {projectSidebar, sidebar} from "@/common/routes";
import DarkLogo from "@/common/assets/images/logo/small-dark.webp";
import LightLogo from "@/common/assets/images/logo/small-light.webp";
import {useContext} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project/index.js";

const drawerWidth = 260;

export const Sidebar = ({mobileOpen, toggleOpen, window: containerWindow}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const {currentProject} = useContext(ProjectContext);
    const logo = theme.palette.mode === "dark" ? DarkLogo : LightLogo;

    const container = containerWindow !== undefined ? () => containerWindow().document.body : undefined;

    const isSelected = (path) => {
        if (path === "/") return location.pathname === "/";

        return location.pathname.replace(currentProject?.id, ":projectId").startsWith(path);
    }

    const getSidebar = (sidebar) => sidebar.map(({name, icon, path}) => (
        <ListItem key={path}>
            <ListItemButton onClick={() => navigate(path.replace(":projectId", currentProject?.id))} selected={isSelected(path)}>
                <ListItemIcon color="text.secondary">{icon}</ListItemIcon>
                <ListItemText primary={name}/>
            </ListItemButton>
        </ListItem>
    ));


    const drawer = (
        <>
            <Toolbar>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    <img src={logo} alt="Logo" style={{width: "2rem"}}/>
                    <Typography variant="h5"><span style={{fontWeight: "bold"}}>License</span>API</Typography>
                </Stack>
            </Toolbar>

            <List>
                <Box sx={{mb: 1}}>
                    <Typography variant="p" sx={{ml: 1.5, mt: 2, mb: 2}} fontWeight={700} color="text.secondary">
                        LicenseAPI</Typography>
                    {getSidebar(sidebar)}
                </Box>
                {currentProject !== null && <Box sx={{mb: 1}}>
                    <Typography variant="p" sx={{ml: 1.5, mt: 2, mb: 2}} fontWeight={700} color="text.secondary">
                        Project management</Typography>
                    {getSidebar(projectSidebar)}
                </Box>}
            </List>
        </>
    );

    return (
        <>
            <Drawer container={container} variant="temporary" open={mobileOpen} onClose={toggleOpen}
                    ModalProps={{keepMounted: true}} sx={{
                display: {xs: 'block', sm: 'none'},
                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
            }}>
                {drawer}
            </Drawer>
            <Drawer variant="permanent" sx={{
                display: {xs: 'none', sm: 'block'},
                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
            }} open>
                {drawer}
            </Drawer>
        </>
    )
}