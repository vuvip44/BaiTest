using WebApplication1.Models;

namespace WebApplication1.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<IEnumerable<User>> GetByGroupIdAsync(int groupId);
        Task<User> GetByIdAsync(int id);
        Task<User> AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
} 