import {Avatar, Box, Divider, Typography} from "@mui/material";
import {ProjectContext} from "@/states/Dashboard/contexts/Project";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";

export const ProjectBox = ({project, style}) => {


    const {setCurrentProject} = useContext(ProjectContext);
    const navigate = useNavigate();

    const switchProject = () => {
        setCurrentProject(project);
        navigate("/projects/" + project.id + "/stats");
    }

    return (
        <Box justifyContent="center" alignItems="center" display="flex" borderRadius="10px"
             border="1px solid #ccc" p={2.5} sx={style} onClick={switchProject}>
            <Avatar sx={{width: "50px", height: "50px", marginRight: "10px"}} variant="rounded">
                {project.name.charAt(0).toUpperCase()}
            </Avatar>

            <Divider orientation="vertical" sx={{marginRight: "10px", height: "35px"}} />

            <Typography variant="h5">{project.name}</Typography>
        </Box>
    );
}