using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Group>()
                .HasIndex(g => g.Code)
                .IsUnique();

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Parent)
                .WithMany(g => g.Children)
                .HasForeignKey(g => g.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 