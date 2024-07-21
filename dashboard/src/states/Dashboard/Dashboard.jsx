import {Box, Link, Toolbar, Typography} from "@mui/material";
import {Outlet} from "react-router-dom";
import Header from "@/states/Dashboard/components/Header";
import Sidebar from "@/states/Dashboard/components/Sidebar";
import {useContext, useState} from "react";
import {ProjectProvider} from "@/states/Dashboard/contexts/Project";
import {InfoContext} from "@contexts/Info/index.js";

export const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const {info} = useContext(InfoContext);

    return (
        <ProjectProvider>
            <Box sx={{display: "flex", overflow: "hidden"}}>
                <Header mobileOpen={mobileOpen} toggleOpen={() => setMobileOpen(current => !current)}/>
                <Sidebar mobileOpen={mobileOpen} toggleOpen={() => setMobileOpen(current => !current)}/>
                <Box component="main" sx={{flexGrow: 1, p: 3, ml: {sm: "260px"}, mb: "2rem"}}>
                    <Toolbar/>
                    <Outlet/>
                </Box>
                <Box sx={{
                    display: "flex", justifyContent: "space-between", position: "fixed", bottom: 0,
                    ml: {sm: "260px"}, width: {sm: "calc(100% - 260px)", xs: "100%"}, py: 1, px: 2,
                    backgroundColor: "background.paper", borderTop: 1, borderColor: "divider", alignItems: "center"
                }}>
                    <Typography variant="caption" color="text.secondary">
                        © 2021 - {new Date().getFullYear()}
                        <Link href="https://github.com/gnmyt/LicenseAPI" target="_blank" color="primary" sx={{ml: 0.5}}>
                            LicenseAPI
                        </Link>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Version {info.version}</Typography>
                </Box>
            </Box>
        </ProjectProvider>
    )
}