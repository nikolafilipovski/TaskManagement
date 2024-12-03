import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const TaskContext = createContext();

export function useTasks() {
    return useContext(TaskContext);
}

// eslint-disable-next-line react/prop-types
export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);     

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get("https://localhost:44334/api/Task/GetAllTasks", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = async (task) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post("https://localhost:44334/api/Task/CreateTask", task, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const updateTask = async (task) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(
                `https://localhost:44334/api/Task/UpdateTask/${task.id}`,
                task, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    }
                }
            );

            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`https://localhost:44334/api/Task/DeleteTask/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (token) 
            fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
}
