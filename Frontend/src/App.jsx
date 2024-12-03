import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskProvider } from "./context/TaskContext";
import Login from "./components/Login";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("jwtToken");
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <TaskProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <StartupRedirect>
                                <ProtectedRoute>
                                    <TaskList />
                                </ProtectedRoute>
                            </StartupRedirect>
                        }
                    />
                </Routes>
            </TaskProvider>
        </Router>
    );
}

function StartupRedirect({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const firstVisit = localStorage.getItem("firstVisit");
        if (!firstVisit) {
            localStorage.setItem("firstVisit", "false");
            navigate("/login"); 
        }
    }, [navigate]);

    return children;
}

export default App;
