import {Stack, Tab, Tabs} from "@mui/material";
import Logo from "@/states/Login/components/Logo";
import {useContext, useState} from "react";
import LoginTab from "@/states/Login/tabs/LoginTab";
import RegisterTab from "@/states/Login/tabs/RegisterTab";
import {InfoContext} from "@contexts/Info";

export const Login = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const {info} = useContext(InfoContext);

    const [showTabs, setShowTabs] = useState(true);

    return (
        <Stack justifyContent="center" alignItems="center" sx={{height: {xs: "100%",sm: "100vh"}}} gap={2}>
            <Logo/>

            {info.signupEnabled && showTabs && <Tabs value={currentPage} onChange={(e, v) => setCurrentPage(v)}>
                <Tab label="Login"/>
                <Tab label="Register"/>
            </Tabs>}

            {currentPage === 0 && <LoginTab />}
            {currentPage === 1 && <RegisterTab setShowTabs={setShowTabs} />}
        </Stack>
    )
}