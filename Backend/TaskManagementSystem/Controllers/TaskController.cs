using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystemData.Entities;
using TaskManagementSystemService;
using TaskManagementSystemService.Interfaces;

namespace TaskManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITasksService _tasksService;

        public TaskController(ITasksService tasksService)
        {
            _tasksService = tasksService;
        }

        [Authorize]
        [HttpGet("GetAllTasks")]
        public async Task<ActionResult<IEnumerable<Task>>> GetAllTasks()
        {
            var tasks = await _tasksService.GetAllTasks();
            return Ok(tasks);
        }

        [Authorize]
        [HttpPost("CreateTask")]
        public async Task<ActionResult<Task>> CreateTask(TaskDto task)
        {
            var createdTask = await _tasksService.CreateTask(task);
            return CreatedAtAction(nameof(GetAllTasks), new { id = createdTask.Id }, createdTask);
        }

        [Authorize]
        [HttpPut("UpdateTask/{taskId}")]
        public async Task<ActionResult<Task>> UpdateTask(int taskId, TaskDto task)
        {
            if (taskId != task.Id)
                return BadRequest("Task Id not the same.");

            var updatedTask = await _tasksService.UpdateTask(task);

            if (updatedTask == null)
                return NotFound();

            return Ok(updatedTask);
        }

        [Authorize]
        [HttpDelete("DeleteTask/{taskId}")]
        public async Task<ActionResult<bool>> DeleteTask(int taskId)
        {
            var success = await _tasksService.DeleteTask(taskId);

            if (!success)
                return NotFound();

            return true; 
        }

        // GET /api/tasks/search?description=meeting&page=1&pageSize=5
        [HttpGet("search")]
        public async Task<ActionResult> SearchTasks([FromQuery] string description, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (tasks, totalItems) = await _tasksService.SearchTasksAsync(description, page, pageSize);
            return Ok(new
            {
                Tasks = tasks,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize)
            });
        }

        // GET: /api/Tasks?page=2&pageSize=5
        [HttpGet]
        public async Task<ActionResult> GetTasks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (tasks, totalItems) = await _tasksService.GetAllTasksAsync(page, pageSize);
            return Ok(new
            {
                Tasks = tasks,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize)
            });
        }  
    }
}