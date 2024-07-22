import {AppBar, Avatar, IconButton, MenuItem, Select, Stack, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import {projectSidebar, sidebar} from "@/common/routes";
import {useLocation, useNavigate} from "react-router-dom";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {UserContext} from "@contexts/User";
import AccountMenu from "@/states/Dashboard/components/Header/components/AccountMenu";

const drawerWidth = 260;

export const Header = ({toggleOpen}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {currentProject, projects, setCurrentProject} = useContext(ProjectContext);
    const {user} = useContext(UserContext);

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.title = "LicenseAPI - " + getTitleByPath();
    }, [location]);

    const getTitleByPath = () => {
        const route = [...sidebar, ...projectSidebar].find((route) => location.pathname
            .replace(currentProject?.id, ":projectId").startsWith(route.path) && route.path !== "/");
        if (route) return route.name;
        return "Start";
    }

    const switchProject = (project) => {
        if (!project) return;
        const path = location.pathname.replace(currentProject.id, project.id);
        setCurrentProject(project);

        navigate(-1);
        setTimeout(() => navigate(path), 100);
    }

    return (
        <>
            <AccountMenu open={menuOpen} setOpen={setMenuOpen}/>
            <AppBar position="fixed" sx={{width: {sm: `calc(100% - ${drawerWidth}px)`}, ml: {sm: `${drawerWidth}px`}}}
                    color="inherit">
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleOpen}
                                sx={{mr: 2, display: {sm: 'none'}}}>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" fontWeight={700}>{getTitleByPath()}</Typography>

                    <Stack direction="row" spacing={2} sx={{ml: "auto"}} alignItems="center">

                        <Select size="small" value={currentProject?.id}
                                onChange={(e) => switchProject(projects.find((project) => project.id === e.target.value))}>
                            {projects.map((project) => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
                        </Select>

                        <Stack sx={{background: "linear-gradient(90deg, #FF0401 0%, #FE6E27 100%)", padding: "3px",
                            borderRadius: "50%", cursor: "pointer"}} onClick={() => setMenuOpen(true)} id="menu"
                               alignItems="center" direction="row" spacing={1}>
                            <Avatar src={user.avatar} alt={user.username}/>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    )
}