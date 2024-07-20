import Home from "@/states/Dashboard/pages/Home";
import {
    AdminPanelSettings,
    BarChart, ContactSupport,
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

export const routes = [
    {path: "/", element: <Home/>},
    {path: "/support", element: <h1>Support</h1>},
    {path: "/projects/:projectId/stats", element: <Statistic />},
    {path: "/projects/:projectId/licenses", element: <Licenses />},
    {path: "/projects/:projectId/permissions", element: <h1>Permissions</h1>},
    {path: "/projects/:projectId/groups", element: <h1>Groups</h1>},
    {path: "/projects/:projectId/meta", element: <h1>Meta-Data</h1>},
    {path: "/projects/:projectId/keys", element: <h1>Access keys</h1>},
    {path: "/projects/:projectId/members", element: <h1>Members</h1>},
    {path: "/projects/:projectId/info", element: <Info />}
]

export const sidebar = [
    {
        path: "/",
        icon: <HomeIcon />,
        name: "Start"
    },
    {
        path: "/support",
        icon: <ContactSupport />,
        name: "Support"
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