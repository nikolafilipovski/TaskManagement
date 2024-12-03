import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import axios from "axios";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const { fetchTasks } = useTasks();
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};

        if (!username)
            errors.username = "Username is required.";
        else if (password.length < 3)
            errors.username = "Username must be at least 3 characters long.";
        
        if (!password) 
            errors.password = "Password is required.";
        else if (password.length < 6) 
            errors.password = "Password must be at least 6 characters long.";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;

        const user = { username, password };

        try {
            const response = await axios.post("https://localhost:44334/login", user);
            const token = response.data.token;
            localStorage.setItem("jwtToken", token);
            navigate("/");
        } catch (error) {
            setError("Login failed. Wrong username or password.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
                <h1 className="text-center mb-4">Login</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className={`form-control ${validationErrors.username ? "is-invalid" : ""}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {validationErrors.username && (
                            <div className="invalid-feedback">{validationErrors.username}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${validationErrors.password ? "is-invalid" : ""}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {validationErrors.password && (
                            <div className="invalid-feedback">{validationErrors.password}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;