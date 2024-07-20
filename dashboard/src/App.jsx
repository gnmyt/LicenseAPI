import {UserProvider} from "@contexts/User";
import {InfoProvider} from "@contexts/Info";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Dashboard from "@/states/Dashboard";
import {routes} from "@/common/routes";

const router = createBrowserRouter([
    {path: "/", element: <Dashboard/>, children: routes},
])

export default () => {
    return (
        <InfoProvider>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </InfoProvider>
    )
}