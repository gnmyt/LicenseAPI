import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Stack
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {
    AdminPanelSettings,
    CalendarMonth,
    Group,
    Key,
    TableChart
} from "@mui/icons-material";
import DialogField from "./components/DialogField";
import LicenseKey from "./pages/LicenseKey";
import Permissions from "./pages/Permissions";
import Groups from "./pages/Groups";
import MetaData from "./pages/MetaData";
import {replaceLicenseDefaults} from "./pages/LicenseKey/util.js";
import ExpirationDate from "./pages/ExpirationDate";
import dayjs from "dayjs";
import {patchRequest, putRequest} from "@/common/utils/RequestUtil.js";

const TransitionWrapper = ({direction, in: inProp, children}) => {
    return (
        <Slide direction={direction} in={inProp} mountOnEnter unmountOnExit
               timeout={{enter: 300, exit: 0}}>
            <div style={{position: inProp ? 'static' : 'absolute', width: '100%'}}>
                {children}
            </div>
        </Slide>
    );
};

export const LicenseDialog = ({open, onClose, switchToEnd, editLicense, setEditLicense}) => {
    const {currentProject} = useContext(ProjectContext);

    const [currentPage, setCurrentPage] = useState("chooser");

    const [licenseKey, setLicenseKey] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [metaData, setMetaData] = useState({});

    useEffect(() => {
        if (!open) return;
        setCurrentPage("chooser");

        if (editLicense) {
            setLicenseKey(editLicense.key);
            setExpirationDate(editLicense.expirationDate);
            setPermissions(editLicense.permissions);
            setGroups(editLicense.groups);
            setMetaData(editLicense.meta);
        } else {
            setLicenseKey(replaceLicenseDefaults(currentProject.defaults.licenseKey));
            setExpirationDate(currentProject.defaults.expirationDate);
            setPermissions(currentProject.defaults.permissions);
            setGroups(currentProject.defaults.groups);
            setMetaData({});
        }
    }, [open]);

    const goBack = () => {
        setCurrentPage("chooser");
    };

    const closeDialog = () => {
        setEditLicense(null);
        onClose();
    }

    const createLicense = async () => {
        try {
            closeDialog();
            const {key} = await putRequest(`/license/${currentProject.id}`, {key: licenseKey,
                expirationDate: new Date(expirationDate).getTime() === 0 ? 0 : expirationDate, permissions,
                groups, meta: metaData});
            switchToEnd(key);
        } catch (e) {
            console.error(e);
        }
    }

    const patchLicense = async () => {
        try {
            closeDialog();
            await patchRequest(`/license/${currentProject.id}/${encodeURIComponent(editLicense.key)}`,
                {key: licenseKey, expirationDate: new Date(expirationDate).getTime() === 0 ? 0 : expirationDate,
                    permissions, groups, meta: metaData});
            switchToEnd(licenseKey);
        } catch (e) {
            console.error(e);
        }
    }

    const upperCaseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle onClick={() => setCurrentPage("chooser")} sx={{cursor: currentPage !== "chooser"
                    ? "pointer" : "default"}}>{editLicense ? "Edit" : "Create"} license {currentPage !== "chooser" &&
                <>› {upperCaseFirstLetter(currentPage)}</>}</DialogTitle>
            <DialogContent sx={{width: 400, overflow: "hidden"}}>
                <TransitionWrapper direction="right" in={currentPage === "chooser"}>
                    <Stack gap={1}>
                        <DialogField icon={<Key color="primary"/>} title="Set key" description={licenseKey}
                                     onClick={() => setCurrentPage("key")}/>

                        <DialogField icon={<CalendarMonth color="primary"/>} title="Set expiration date"
                                     description={new Date(expirationDate).getTime() === 0 ? "Never"
                                         : dayjs(expirationDate).format("DD.MM.YYYY HH:mm")}
                                     onClick={() => setCurrentPage("expiration")}/>

                        <DialogField icon={<AdminPanelSettings color="primary"/>} title="Set permissions"
                                     description={permissions.length === 0 ? "None" : permissions.join(", ")}
                                        onClick={() => setCurrentPage("permissions")}/>

                        <DialogField icon={<Group color="primary"/>} title="Set groups"
                                        description={groups.length === 0 ? "None" : groups.join(", ")}
                                        onClick={() => setCurrentPage("groups")}/>

                        <DialogField icon={<TableChart color="primary"/>} title="Set meta data"
                                     description={Object.keys(metaData).length === 0 ? "None" : Object.keys(metaData).join(", ")}
                                        onClick={() => setCurrentPage("meta")}/>
                    </Stack>
                </TransitionWrapper>

                <TransitionWrapper direction="left" in={currentPage === "key"}>
                    <Stack gap={1}>
                        <LicenseKey licenseKey={licenseKey} setLicenseKey={setLicenseKey} goBack={goBack}/>
                    </Stack>
                </TransitionWrapper>

                <TransitionWrapper direction="left" in={currentPage === "expiration"}>
                    <Stack gap={1}>
                        <ExpirationDate expirationDate={expirationDate} setExpirationDate={setExpirationDate}
                                        goBack={goBack}/>
                    </Stack>
                </TransitionWrapper>

                <TransitionWrapper direction="left" in={currentPage === "permissions"}>
                    <Stack gap={1}>
                        <Permissions permissions={permissions} setPermissions={setPermissions}/>
                    </Stack>
                </TransitionWrapper>

                <TransitionWrapper direction="left" in={currentPage === "groups"}>
                    <Stack gap={1}>
                        <Groups groups={groups} setGroups={setGroups}/>
                    </Stack>
                </TransitionWrapper>

                <TransitionWrapper direction="left" in={currentPage === "meta"}>
                    <Stack gap={1}>
                        <MetaData metaData={metaData} setMetaData={setMetaData}/>
                    </Stack>
                </TransitionWrapper>
            </DialogContent>
            <DialogActions>
                {currentPage !== "chooser" && <Button onClick={() => setCurrentPage("chooser")}>Back</Button>}
                {currentPage === "chooser" && <Button onClick={editLicense ? patchLicense : createLicense}
                                                        color="primary">
                    {editLicense ? "Update" : "Create"}
                </Button>}
            </DialogActions>
        </Dialog>
    );
}
