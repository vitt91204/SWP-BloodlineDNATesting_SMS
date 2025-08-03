using Repositories.Base;
using Repositories.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class BlogPostRepository : GenericRepository<BlogPost>
    {
        public BlogPostRepository() : base() { }

        public async Task<BlogPost?> GetByIdAsync(int id)
        {
            return await context.BlogPosts.FindAsync(id);
        }

        public async Task<List<BlogPost>> GetAllAsync()
        {
            return await context.BlogPosts.ToListAsync();
        }

        public async Task UpdateAsync(BlogPost post)
        {
            context.BlogPosts.Update(post);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(BlogPost post)
        {
            context.BlogPosts.Remove(post);
            await context.SaveChangesAsync();
        }
    }
}