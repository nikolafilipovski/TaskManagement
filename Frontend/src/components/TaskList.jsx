import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskModal } from "./TaskModal";
import { useNavigate } from "react-router-dom";

export function TaskList() {
    const { tasks, deleteTask } = useTasks();
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    const filteredTasks = tasks.filter(task =>
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "" || task.status === statusFilter)
    );

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const handleAddClick = () => {
        setTaskToEdit(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTaskToEdit(null);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-center">Tasks Table</h1>
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
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTasks.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No tasks available
                                </td>
                            </tr>
                        ) : (
                            currentTasks.map((task, index) => (
                                <tr key={task.id}>
                                    <th scope="row">{indexOfFirstTask + index + 1}</th>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        <span className={`badge bg-primary`}>
                                            {task.status}
                                        </span>
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
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`btn mx-1 ${currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {showModal && <TaskModal task={taskToEdit} onClose={handleCloseModal} />}
        </div>
    );
}