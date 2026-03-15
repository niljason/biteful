import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import auth from "../features/auth/services/auth";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        auth.logout();
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    }

    return (
        <div className="layout-container">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

            <main className="content-area">
                <Outlet context={handleLoginSuccess} />
            </main>

            <footer className="footer">
                <p>© 2026 Modular React + Drogon C++</p>
            </footer>
        </div>
    );
};

export default MainLayout;
