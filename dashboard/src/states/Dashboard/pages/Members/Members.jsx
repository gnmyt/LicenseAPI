import {useContext, useEffect, useState} from "react";
import {deleteRequest, getRequest} from "@/common/utils/RequestUtil.js";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {Button, Chip, CircularProgress, IconButton, Link, Stack, Typography} from "@mui/material";
import {AdminPanelSettings, Delete} from "@mui/icons-material";
import MemberCreationDialog from "./components/MemberCreationDialog";

export const Members = () => {
    const {currentProject} = useContext(ProjectContext);

    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [editUser, setEditUser] = useState(null);

    const fetchMembers = async () => {
        try {
            const data = await getRequest(`/member/${currentProject.id}/list`);

            if (!data) return;

            setMembers(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const deleteMember = async (member) => {
        try {
            await deleteRequest(`/member/${currentProject.id}/${member}`);
            await fetchMembers();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchMembers();

        const timer = setInterval(fetchMembers, 5000);

        return () => clearInterval(timer);
    }, []);

    const getUserRole = (role) => {
        switch (role) {
            case 0:
                return "Viewer";
            case 1:
                return "Project manager";
            case 2:
                return "Administrator";
        }

        return "Unknown";
    }

    return (
        <Stack>
            <MemberCreationDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                                      fetchMembers={fetchMembers} editUser={editUser} setEditUser={setEditUser}/>

            <Stack justifyContent="space-between" direction="row" sx={{mb: 2}} alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                    {loading && <>Members</>}
                    {!loading && <>{members.length} Members</>}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Invite
                    member</Button>
            </Stack>

            <Stack direction="row" gap={2} sx={{mt: 2, mx: 5}} alignItems="center" flexWrap="wrap">
                {members.map((member, index) => (
                    <Stack key={index} direction="row" alignItems="center" justifyContent="space-between"
                           width={{xs: "100%", lg: "49%"}}
                           sx={{border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 2}}>
                        <Stack sx={{flexGrow: 1}}>
                            <Stack direction="row" gap={1} alignItems="center">
                                <img src={member.user.avatar} alt="avatar" width={30} height={30}
                                        style={{borderRadius: "50%"}}/>
                                <Typography variant="body1" fontWeight={600}>{member.user.username}</Typography>
                                {!member.accepted && <Chip label="Pending" color="warning"/>}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{getUserRole(member.role)}</Typography>
                        </Stack>

                        <Stack justifyContent="flex-end" direction="row">
                            <IconButton color="primary" onClick={() => {
                                setEditUser(member);
                                setDialogOpen(true);
                            }}><AdminPanelSettings/></IconButton>
                            <IconButton color="primary"
                                        onClick={() => deleteMember(member.user.id)}><Delete/></IconButton>
                        </Stack>
                    </Stack>
                ))}

                {loading && <Stack justifyContent="center" alignItems="center" sx={{width: "100%"}}>
                    <CircularProgress color="primary"/>
                </Stack>}

                {!loading && members.length === 0 && <Stack justifyContent="center" alignItems="center"
                                                                sx={{width: "100%"}}>
                    <Typography variant="h5" color="text.secondary">
                        No members invited. <Link onClick={() => setDialogOpen(true)} color="primary"
                                                      sx={{cursor: "pointer"}}>Invite one</Link>
                    </Typography>
                </Stack>}
            </Stack>
        </Stack>
    );
}