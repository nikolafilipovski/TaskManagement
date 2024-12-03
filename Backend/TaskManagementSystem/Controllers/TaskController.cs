using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementSystemData.Entities;
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
    }
}