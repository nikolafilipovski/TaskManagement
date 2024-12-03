using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TaskManagementSystemData;
using TaskManagementSystemData.Entities;

namespace TaskManagementSystemRepository.Interfaces
{
    public interface ITasksRepository 
    {
        Task<IEnumerable<TaskDto>> GetAllTasks();
        Task<TaskDto> CreateTask(TaskDto task);
        Task<TaskDto> UpdateTask(TaskDto task);
        Task<bool> DeleteTask(int taskId);
        Task<(IEnumerable<TaskDto>, int)> GetAllTasksAsync(int page, int pageSize);
        Task<(IEnumerable<TaskDto>, int)> SearchTasksAsync(string description, int page, int pageSize);
    }
}
