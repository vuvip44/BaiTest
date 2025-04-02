using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IGroupRepository
    {
        Task<IEnumerable<Group>> GetAllAsync();
        Task<Group> GetByIdAsync(int id);
        Task<Group> AddAsync(Group group);
        Task UpdateAsync(Group group);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code);
        Task<bool> ExistsAsync(string code, int excludeId);
    }
} 