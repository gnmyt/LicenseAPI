import {Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {UserContext} from "@contexts/User";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import ProjectBox from "./components/ProjectBox";

export const Home = () => {

    const {user} = useContext(UserContext);
    const {projects} = useContext(ProjectContext);

    return (
        <Stack gap={2}>
            <Typography variant="h2" fontWeight="bold">Dashboard</Typography>
            <Typography variant="h5">Welcome back, <Typography variant="span"
                                                                    color="primary">{user.username}</Typography>.</Typography>

            <Typography variant="h4" fontWeight="bold" mt={3}>Your projects:</Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
                {projects.map((project, index) => <ProjectBox project={project} key={index}/>)}
            </Stack>
        </Stack>
    )
}