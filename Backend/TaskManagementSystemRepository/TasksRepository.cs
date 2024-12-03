using Microsoft.EntityFrameworkCore;
using TaskManagementSystemData;
using TaskManagementSystemData.Entities;
using TaskManagementSystemRepository.Interfaces;

namespace TaskManagementSystemRepository
{
    public class TasksRepository : ITasksRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public TasksRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TaskDto> CreateTask(TaskDto task)
        {
            var result = await _dbContext.AddAsync(task);
            await _dbContext.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
                return false;
            
            _dbContext.Tasks.Remove(task); // First i am removing the task becouse i have a problem with update

            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasks()
        {
            var result = await _dbContext.Tasks.ToListAsync(); 
            return (IEnumerable<TaskDto>)result;
        }

        public async Task<TaskDto> UpdateTask(TaskDto task)
        {
            var existingTask = await _dbContext.Tasks.FindAsync(task.Id);

            if (existingTask == null)
                return null;

            existingTask.Title = task.Title;
            existingTask.Status = task.Status;  
            existingTask.Description = task.Description;  
            existingTask.DueDate = task.DueDate;  

            await _dbContext.SaveChangesAsync();

            return existingTask;
        }
    }
}
