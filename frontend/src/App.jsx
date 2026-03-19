import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginForm from "./features/auth/components/LoginForm";
import SignupForm from "./features/users/components/SignupForm";
import Dashboard from "./features/users/components/Dashboard";

function App() {
    // check if session id exists
    const isAuthenticated = () => {
        return localStorage.getItem("sessionId") !== null;
    };

    isAuthenticated();

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />

                    {/* Protected Route */}
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated() ? (
                                <Dashboard />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Default Route */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to={isAuthenticated() ? "/dashboard" : "/login"}
                            />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
