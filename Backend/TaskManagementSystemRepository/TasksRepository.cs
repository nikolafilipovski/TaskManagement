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

        public async Task<(IEnumerable<TaskDto>, int)> GetAllTasksAsync(int page, int pageSize)
        {
            var query = _dbContext.Tasks.AsQueryable();

            var totalItems = await query.CountAsync();
            var tasks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            return (tasks, totalItems);
        }

        public async Task<(IEnumerable<TaskDto>, int)> SearchTasksAsync(string description, int page, int pageSize)
        {
            var query = _dbContext.Tasks.AsQueryable();

            if (!string.IsNullOrEmpty(description))
            {
                query = query.Where(t => t.Description.Contains(description));
            }

            var totalItems = await query.CountAsync();
            var tasks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

            return (tasks, totalItems);
        }
    }
}
