using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            return await _context.Groups
                .Include(g => g.Parent)
                .OrderBy(g => g.OrderNumber)
                .ToListAsync();
        }

        public async Task<Group> GetByIdAsync(int id)
        {
            return await _context.Groups
                .Include(g => g.Parent)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Group> AddAsync(Group group)
        {
            // Get max order number for the same parent level
            var maxOrder = await _context.Groups
                .Where(g => g.ParentId == group.ParentId)
                .MaxAsync(g => (int?)g.OrderNumber) ?? 0;

            // Set new order number
            group.OrderNumber = maxOrder + 1;

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();
            return group;
        }

        public async Task UpdateAsync(Group group)
        {
            var existingGroup = await _context.Groups.FindAsync(group.Id);
            if (existingGroup != null)
            {
                // If parent changed, update order numbers
                if (existingGroup.ParentId != group.ParentId)
                {
                    // Decrease order numbers in old parent
                    await DecreaseOrderNumbersAsync(existingGroup.ParentId, existingGroup.OrderNumber);

                    // Get max order number in new parent
                    var maxOrder = await _context.Groups
                        .Where(g => g.ParentId == group.ParentId)
                        .MaxAsync(g => (int?)g.OrderNumber) ?? 0;

                    group.OrderNumber = maxOrder + 1;
                }

                _context.Entry(existingGroup).CurrentValues.SetValues(group);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var group = await _context.Groups.FindAsync(id);
            if (group != null)
            {
                _context.Groups.Remove(group);
                await _context.SaveChangesAsync();

                // Decrease order numbers for remaining groups
                await DecreaseOrderNumbersAsync(group.ParentId, group.OrderNumber);
            }
        }

        private async Task DecreaseOrderNumbersAsync(int? parentId, int deletedOrderNumber)
        {
            var groupsToUpdate = await _context.Groups
                .Where(g => g.ParentId == parentId && g.OrderNumber > deletedOrderNumber)
                .ToListAsync();

            foreach (var group in groupsToUpdate)
            {
                group.OrderNumber--;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(string code)
        {
            return await _context.Groups.AnyAsync(g => g.Code == code);
        }

        public async Task<bool> ExistsAsync(string code, int excludeId)
        {
            return await _context.Groups.AnyAsync(g => g.Code == code && g.Id != excludeId);
        }
    }
} 