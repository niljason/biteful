import { Outlet, useNavigate } from "react-router-dom";
import auth from "../features/auth/services/auth";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => {
    const navigate = useNavigate();
    const isAuthenticated = () => {
        return localStorage.getItem("sessionId") !== null;
    };

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <div className="layout-container">
            <Navbar
                isAuthenticated={isAuthenticated()}
                onLogout={handleLogout}
            />

            <main className="content-area">
                <Outlet />
            </main>

            <footer className="footer">
                <p>© 2026 Modular React + Drogon C++</p>
            </footer>
        </div>
    );
};

export default MainLayout;
