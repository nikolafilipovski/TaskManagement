using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagementSystemData.Entities;
using TaskManagementSystemRepository.Interfaces;

namespace TaskManagementSystemService.Interfaces
{
    public interface ITasksService
    {
        Task<IEnumerable<TaskDto>> GetAllTasks();
        Task<TaskDto> CreateTask(TaskDto task);
        Task<TaskDto> UpdateTask(TaskDto task);
        Task<bool> DeleteTask(int taskId);
    }
}
