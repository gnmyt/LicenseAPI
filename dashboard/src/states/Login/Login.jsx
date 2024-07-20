import {Stack, Tab, Tabs} from "@mui/material";
import Logo from "@/states/Login/components/Logo";
import {useState} from "react";
import LoginTab from "@/states/Login/tabs/LoginTab";
import RegisterTab from "@/states/Login/tabs/RegisterTab";

export const Login = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const [showTabs, setShowTabs] = useState(true);

    return (
        <Stack justifyContent="center" alignItems="center" sx={{height: {xs: "100%",sm: "100vh"}}} gap={2}>
            <Logo/>

            {showTabs && <Tabs value={currentPage} onChange={(e, v) => setCurrentPage(v)}>
                <Tab label="Login"/>
                <Tab label="Register"/>
            </Tabs>}

            {currentPage === 0 && <LoginTab />}
            {currentPage === 1 && <RegisterTab setShowTabs={setShowTabs} />}
        </Stack>
    )
}