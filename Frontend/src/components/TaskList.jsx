import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskModal } from "./TaskModal";
import { useNavigate } from "react-router-dom";

export function TaskList() {
    const { tasks, fetchTasks, page, totalPages, totalItems, deleteTask } = useTasks();
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks(page);
    }, [page, fetchTasks]);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? task.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handlePageChange = (pageNumber) => {
        fetchTasks(pageNumber);
    };

    const handleAddClick = () => {
        setTaskToEdit(null);
        setShowModal(true);
    };

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTaskToEdit(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Tasks Table</h1>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="d-flex justify-content-between mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select
                    className="form-select w-25"
                    value={statusFilter}
                    onChange={handleStatusChange}
                >
                    <option value="">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                </select>
                <button className="btn btn-primary" onClick={handleAddClick}>
                    Add New Task
                </button>
            </div>

            <div className="mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks?.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <tr key={task.id}>
                                    <th>{(page - 1) * 5 + index + 1}</th>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        <span className={`badge bg-primary`}>{task.status}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm mx-1"
                                            onClick={() => handleEditClick(task)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm mx-1"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No tasks available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`btn mx-1 ${page === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <div className="text-center mt-3">
                Total Tasks: {totalItems}
            </div>

            {showModal && <TaskModal task={taskToEdit} onClose={handleCloseModal} />}
        </div>
    );
}
