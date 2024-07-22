import Home from "@/states/Dashboard/pages/Home";
import {
    AdminPanelSettings,
    BarChart,
    Group,
    Info as InfoIcon,
    Key,
    Person, Home as HomeIcon,
    TableChart,
    WorkspacePremium
} from "@mui/icons-material";
import Info from "@/states/Dashboard/pages/Info";
import Statistic from "@/states/Dashboard/pages/Statistic";
import Licenses from "@/states/Dashboard/pages/Licenses";
import Permissions from "@/states/Dashboard/pages/Permissions";
import Groups from "@/states/Dashboard/pages/Groups";
import MetaData from "@/states/Dashboard/pages/MetaData";
import AccessKeys from "@/states/Dashboard/pages/AccessKeys";
import Members from "@/states/Dashboard/pages/Members";

export const routes = [
    {path: "/", element: <Home/>},
    {path: "/projects/:projectId/stats", element: <Statistic />},
    {path: "/projects/:projectId/licenses", element: <Licenses />},
    {path: "/projects/:projectId/permissions", element: <Permissions />},
    {path: "/projects/:projectId/groups", element: <Groups />},
    {path: "/projects/:projectId/meta", element: <MetaData/>},
    {path: "/projects/:projectId/keys", element: <AccessKeys />},
    {path: "/projects/:projectId/members", element: <Members />},
    {path: "/projects/:projectId/info", element: <Info />}
]

export const sidebar = [
    {
        path: "/",
        icon: <HomeIcon />,
        name: "Home"
    }
]

export const projectSidebar = [
    {
        path: "/projects/:projectId/stats",
        icon: <BarChart />,
        name: "Statistics"
    },
    {
        path: "/projects/:projectId/licenses",
        icon: <WorkspacePremium />,
        name: "Licenses"
    },
    {
        path: "/projects/:projectId/permissions",
        icon: <AdminPanelSettings />,
        name: "Permissions"
    },
    {
        path: "/projects/:projectId/groups",
        icon: <Group />,
        name: "Groups"
    },
    {
        path: "/projects/:projectId/meta",
        icon: <TableChart />,
        name: "Meta-Data"
    },
    {
        path: "/projects/:projectId/keys",
        icon: <Key />,
        name: "Access keys"
    },
    {
        path: "/projects/:projectId/members",
        icon: <Person />,
        name: "Members"
    },
    {
        path: "/projects/:projectId/info",
        icon: <InfoIcon />,
        name: "Project"
    }
]