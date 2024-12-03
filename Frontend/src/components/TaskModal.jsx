/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";

export function TaskModal({ task, onClose }) {
    const { addTask, updateTask } = useTasks();  
    const [title, setTitle] = useState(task ? task.title : "");
    const [description, setDescription] = useState(task ? task.description : "");
    const [status, setStatus] = useState(task ? task.status : "Pending");

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = { title, description, status };

        if (task) 
            updateTask({ ...taskData, id: task.id });
        else 
            addTask(taskData);

        onClose();  
    };

    return (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="taskModalLabel" style={{ display: "block" }} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="taskModalLabel">{task ? "Edit Task" : "Add Task"}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">{task ? "Save Changes" : "Add Task"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
