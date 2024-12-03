import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const TaskContext = createContext();

export function useTasks() {
    return useContext(TaskContext);
}

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]); 
    const [page, setPage] = useState(1); 
    const [pageSize, setPageSize] = useState(5); 
    const [totalItems, setTotalItems] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchTasks = useCallback(async (currentPage = 1, filters = {}) => {
        try {
            const token = localStorage.getItem("jwtToken");
            
            if (!token) {
                console.error("No JWT token found!");
                return;
            }

            const response = await axios.get("https://localhost:44334/api/Task/GetTasks", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: currentPage,
                    pageSize,
                    ...filters,
                },
            });

            setTasks(response.data.tasks || []);
            setTotalItems(response.data.totalItems || 0);
            setTotalPages(response.data.totalPages || 0);
            setPage(response.data.currentPage || 1);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, [pageSize]);

    const addTask = async (task) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.post("https://localhost:44334/api/Task/CreateTask", task, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            fetchTasks(page);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const updateTask = async (task) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.put(
                `https://localhost:44334/api/Task/UpdateTask/${task.id}`,
                task,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            fetchTasks(page);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`https://localhost:44334/api/Task/DeleteTask/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTasks(page);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (token) 
            fetchTasks(page, { search: searchTerm, status: statusFilter });

    }, [page, searchTerm, statusFilter, fetchTasks]);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                page,
                pageSize,
                totalItems,
                totalPages,
                fetchTasks,
                addTask,
                updateTask,
                deleteTask,
                setSearchTerm, 
                setStatusFilter
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}
