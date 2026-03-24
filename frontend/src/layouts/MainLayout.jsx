import { useNavigate, useLocation } from "react-router-dom";
import auth from "../features/auth/services/auth";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation(); // to know which page we r on
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (
        localStorage.getItem("sessionId") !== null &&
        isAuthenticated == false
    ) {
        setIsAuthenticated(true);
    }

    const handleLogout = async () => {
        await auth.logout();
        setIsAuthenticated(false);
        navigate("/login");
    };

    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
    return (
        <div className="layout-container">
            {/* show navbar if NOT on login/signup */}
            {!isAuthPage && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}

            <main className="content-area">
                {isAuthPage ? (
                    /* split screen design for login/signup only */
                    <>
                        <div className="brand-side">
                            <div style={{ fontSize: '4rem' }}>🍴</div> 
                            <h1>Biteful</h1>
                        </div>
                        <div className="form-side">
                            {children}
                        </div>
                    </>
                ) : (
                    /* normal layout */
                    <div className="standard-view">
                        {children}
                    </div>
                )}
            </main>

            {/*  show footer if NOT on login/signup */}
            {!isAuthPage && (
                <footer className="footer">
                    <p>© 2026 Modular React + Drogon C++</p>
                </footer>
            )}
        </div>
    );
};

export default MainLayout;
