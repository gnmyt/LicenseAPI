import {createContext, useEffect, useState} from "react";
import {request} from "@/common/utils/RequestUtil.js";
import Loading from "@/states/Loading";
import Error from "@/states/Error";

export const InfoContext = createContext({});

export const InfoProvider = (props) => {
    const [info, setInfo] = useState({status: "loading"});

    const updateInfo = async () => {
        try {
            setInfo(await request("/info/status"));
        } catch (e) {
            setInfo({status: "offline"});
        }
    }

    useEffect(() => {
        setTimeout(updateInfo, 500);

        const interval = setInterval(() => updateInfo(), 10000);
        return () => clearInterval(interval);
    }, []);

    if (info.status === "loading") return (<Loading/>);
    if (info.status === "offline") return (<Error />);

    return (
        <InfoContext.Provider value={{info, updateInfo}}>
            {props.children}
        </InfoContext.Provider>
    );
}