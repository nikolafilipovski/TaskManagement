using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagementSystemData.Entities;
using TaskManagementSystemRepository.Interfaces;
using TaskManagementSystemService.Interfaces;

namespace TaskManagementSystemService
{
    public class TasksService : ITasksService
    {
        private readonly ITasksRepository _tasksRepository;

        public TasksService(ITasksRepository tasksRepository)
        {
            _tasksRepository = tasksRepository;
        }

        public async Task<TaskDto> CreateTask(TaskDto task)
        {
            try
            {
                var result = await _tasksRepository.CreateTask(task);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            try
            {
                var result = await _tasksRepository.DeleteTask(taskId);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasks()
        {
            try
            {
                var result = await _tasksRepository.GetAllTasks();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<TaskDto> UpdateTask(TaskDto task)
        {
            try
            {
                var result = await _tasksRepository.UpdateTask(task);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
