import { Link, Outlet, useNavigate } from "react-router-dom";
import auth from "../features/auth/services/auth";

const MainLayout = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <div className="layout-container">
            <nav className="navbar">
                <div className="nav-logo">
                    <Link to="/">DrogonApp</Link>
                </div>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </>
                    )}
                </div>
            </nav>

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
