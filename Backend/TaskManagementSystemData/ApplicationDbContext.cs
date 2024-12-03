using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystemData.Entities;

namespace TaskManagementSystemData
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<TaskDto> Tasks { get; set; }
        public DbSet<UserDto> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var adminUser = new UserDto
            {
                Id = 1,
                Username = "admin",
                Password = "password123" 
            };

            modelBuilder.Entity<UserDto>().HasData(adminUser);
        }
    }
}
