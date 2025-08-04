using System.IO;
using System.Threading.Tasks;
using Repositories;
using Services.BlogPostDTO;
using Repositories.Models;

namespace Services
{
    public class BlogPostService
    {
        private readonly BlogPostRepository _repository;

        public BlogPostService(BlogPostRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<BlogPost>> GetAllAsync()
        {
            var posts = await _repository.GetAllAsync();
            return posts;
        }

        public async Task<BlogPost?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        //public async Task<int> CreateAsync(BlogPostDto dto)
        //{
        //    var post = new BlogPost
        //    {
        //        Title = dto.Title,
        //        Content = dto.Content,
        //        CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"))
        //    };
        //    return await _repository.CreateAsync(post);
        //}

        public async Task<bool> UpdateAsync(int id, BlogPostDto dto)
        {
            var post = await _repository.GetByIdAsync(id);
            if (post == null) return false;

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            post.PostImage = dto.PostImage;
            await _repository.UpdateAsync(post);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var post = await _repository.GetByIdAsync(id);
            if (post == null) return false;
            await _repository.DeleteAsync(post);
            return true;
        }

        public async Task<BlogPost> CreateBlogPostAsync(BlogPostDto dto)
        {
            var blogPost = new BlogPost
            {
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                PostImage = dto.PostImage,
            };

            return blogPost;
        }
    }
}