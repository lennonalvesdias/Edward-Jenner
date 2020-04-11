using System.Threading.Tasks;
using EdwardJenner.Models.DTO;
using EdwardJenner.Models.Models;

namespace EdwardJenner.Domain.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> UpdatePassword(string id, UpdatePassword updatePassword);
    }
}
