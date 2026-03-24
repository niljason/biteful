import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate("/dashboard"); // Redirect after successful Drogon auth
        }
    };

    return (
        <div className="auth-card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Authenticating..." : "Login"}
                </button>
            </form>
            {/* link to go to signup */}
            <div className="auth-switch">
                <span>Don't have an account? </span>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
};

export default LoginForm;

