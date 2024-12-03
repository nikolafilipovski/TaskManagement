import React from 'react';
import { useTasks } from './TaskProvider';

const Pagination = () => {
    const { tasks, page, pageSize, totalItems, totalPages, fetchTasks } = useTasks();

    const handlePageChange = (newPage) => {
        fetchTasks(newPage);
    };

    return (
        <div>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                    </div>
                ))}
            </div>

            <div>
                <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>{page} of {totalPages}</span>
                <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
