import {createContext, useEffect, useState} from "react";
import Login from "@/states/Login";
import Loading from "@/states/Loading";
import {postRequest, sessionRequest} from "@/common/utils/RequestUtil.js";
import Verify from "@/states/Verify";

export const UserContext = createContext({});

export const UserProvider = (props) => {
    const [user, setUser] = useState({loggedIn: false});
    const [loading, setLoading] = useState(true);
    const [sessionToken, setSessionToken] = useState(localStorage.getItem("sessionToken") || null);

    const updateUser = async (token) => {
        if (!token && !sessionToken) {
            setUser({loggedIn: false});
            return setLoading(false);
        }

        try {
            setUser({loggedIn: true, ...await sessionRequest("/user/me", "GET", token || sessionToken)});
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setUser({loggedIn: false});
        }
    }

    const logout = async () => {
        await postRequest("/auth/logout", {token: sessionToken});
        localStorage.removeItem("sessionToken");
        setSessionToken(null);
        setUser({loggedIn: false});
    }

    useEffect(() => {
        setTimeout(updateUser, 1000);
    }, []);

    const updateSessionToken = (token) => {
        localStorage.setItem("sessionToken", token);
        setSessionToken(token);
        updateUser(token);
    }

    if (loading) return (<Loading />);

    if (location.pathname.startsWith("/verify")) return <Verify />;

    return (
        <UserContext.Provider value={{user, updateUser, logout, updateSessionToken}}>
            {!loading && !user.loggedIn && <Login />}
            {!loading && user.loggedIn && props.children}
        </UserContext.Provider>
    );
}