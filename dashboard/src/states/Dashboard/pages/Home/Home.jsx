import {Box, Divider, IconButton, Stack, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "@contexts/User";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import ProjectBox from "./components/ProjectBox";
import {Add, Check, Close} from "@mui/icons-material";
import ProjectCreationDialog from "./components/ProjectCreationDialog";
import {getRequest, postRequest} from "@/common/utils/RequestUtil.js";

export const Home = () => {
    const {user} = useContext(UserContext);
    const {projects, updateProjects} = useContext(ProjectContext);

    const [creationDialogOpen, setCreationDialogOpen] = useState(false);
    const [invitations, setInvitations] = useState([]);

    const boxStyle = {cursor: "pointer", "&:hover": {backgroundColor: "divider"},
        "&:active": {backgroundColor: "divider", scale: "0.95"}, "&:focus": {outline: "none"},
        transition: "all 0.1s ease-in-out", userSelect: "none"};

    const manageInvitation = async (invitation, accept) => {
        try {
            await postRequest(`/user/me/invitations/${invitation.id}/${accept ? "accept" : "decline"}`);
            setInvitations(invitations.filter((i) => i.id !== invitation.id));
            await updateProjects();
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const data = await getRequest("/user/me/invitations");
                if (data instanceof Array) setInvitations(data);
            } catch (e) {
                console.error(e.message);
            }
        }

        fetchInvitations();
    }, []);

    return (
        <Stack gap={2}>
            <ProjectCreationDialog open={creationDialogOpen} onClose={() => setCreationDialogOpen(false)} />
            <Typography variant="h2" fontWeight="bold">Dashboard</Typography>
            <Typography variant="h5">Welcome back, <Typography variant="span"
                                                                    color="primary">{user.username}</Typography>.</Typography>

            <Typography variant="h4" fontWeight="bold" mt={3}>Your projects:</Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
                {projects.map((project, index) => <ProjectBox project={project} key={index} style={boxStyle}/>)}
                <Box justifyContent="center" alignItems="center" display="flex" borderRadius="10px"
                     border="1px solid #ccc" p={2.5} sx={boxStyle} onClick={() => setCreationDialogOpen(true)}>

                    <Add sx={{width: "35px", height: "35px", marginRight: "10px"}} />

                    <Divider orientation="vertical" sx={{marginRight: "10px", height: "35px"}} />

                    <Typography variant="h5">Create</Typography>
                </Box>
            </Stack>

            {invitations.length > 0 && <Stack mt={3}>
                <Typography variant="h4" fontWeight="bold">Invitations:</Typography>
                <Stack direction="row" gap={2} flexWrap="wrap">
                    {invitations.map((invitation, index) =>  <Box justifyContent="center" alignItems="center" display="flex" borderRadius="10px"
                                                                                 border="1px solid #ccc" p={2.5}>

                        <Typography variant="h5">{invitation.name}</Typography>
                        <Divider orientation="vertical" sx={{mx: "10px", height: "35px"}} />
                        <Stack direction="row" gap={1}>
                            <IconButton color="success" onClick={() => manageInvitation(invitation, true)}>
                                <Check />
                            </IconButton>
                            <IconButton color="error" onClick={() => manageInvitation(invitation, false)}>
                                <Close />
                            </IconButton>
                        </Stack>
                    </Box>)}
                </Stack>
            </Stack>}
        </Stack>
    )
}