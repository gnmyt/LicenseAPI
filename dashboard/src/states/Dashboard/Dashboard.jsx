import {Box, Toolbar} from "@mui/material";
import {Outlet} from "react-router-dom";
import Header from "@/states/Dashboard/components/Header";
import Sidebar from "@/states/Dashboard/components/Sidebar";
import {useState} from "react";
import {ProjectProvider} from "@/states/Dashboard/contexts/Project";

export const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ProjectProvider>
            <Box sx={{display: "flex", overflow: "hidden"}}>
                <Header mobileOpen={mobileOpen} toggleOpen={() => setMobileOpen(current => !current)} />
                <Sidebar mobileOpen={mobileOpen} toggleOpen={() => setMobileOpen(current => !current)} />
                <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: "260px"} }}>
                    <Toolbar/>
                    <Outlet />
                </Box>
            </Box>
        </ProjectProvider>
    )
}