import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginForm from "./features/auth/components/LoginForm";
import SignupForm from "./features/users/components/SignupForm";
import Dashboard from "./features/users/components/Dashboard";
import PantryExplorer from "./features/pantries/components/PantryExplorer";

const isAuthenticated = () => {
    if (localStorage.getItem("sessionId") === null) {
        throw redirect("/login");
    }
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout>
                <Dashboard />
            </MainLayout>
        ),
        middleware: [isAuthenticated],
    },
    {
        path: "/login",
        element: (
            <MainLayout>
                <LoginForm />
            </MainLayout>
        ),
    },
    {
        path: "/signup",
        element: (
            <MainLayout>
                <SignupForm />
            </MainLayout>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <MainLayout>
                <Dashboard />
            </MainLayout>
        ),
        middleware: [isAuthenticated],
    },
    {
        path: "/map/pantry",
        element: (
            <MainLayout>
                <PantryExplorer />
            </MainLayout>
        ),
        middleware: [isAuthenticated],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
