import {createContext, useEffect, useState} from "react";
import {getRequest} from "@/common/utils/RequestUtil.js";
import Loading from "@/states/Loading";
import {useNavigate, useParams} from "react-router-dom";

export const ProjectContext = createContext({});

export const ProjectProvider = ({children}) => {
    const [projects, setProjects] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);

    const {projectId} = useParams();
    const navigate = useNavigate();

    const updateProjects = async () => {
        try {
            const data = await getRequest("/project/list");

            if (data instanceof Array) {
                setProjects(data);

                if (data.length > 0) {
                    if (projectId) {
                        const project = data.find((project) => project.id === projectId);
                        if (!project) {
                            navigate("/projects/" + data[0].id + "/stats");
                            return setCurrentProject(data[0]);
                        }
                        setCurrentProject(project);
                    } else {
                        setCurrentProject(data[0]);
                    }
                } else {
                    if (projectId) navigate("/");
                    setCurrentProject(null);
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        setTimeout(updateProjects, 1000);
    }, []);

    useEffect(() => {
        const interval = setInterval(updateProjects, 10000);
        return () => clearInterval(interval);
    }, [currentProject]);

    if (projects === null) return <Loading progress={90} />;

    return (
        <ProjectContext.Provider value={{projects, updateProjects, currentProject, setCurrentProject}}>
            {children}
        </ProjectContext.Provider>
    )
}