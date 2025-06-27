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

        public async Task<List<BlogPostDto>> GetAllAsync()
        {
            var posts = await _repository.GetAllAsync();
            return posts.Select(p => new BlogPostDto
            {
                AuthorId = p.AuthorId ?? 0, // Explicitly handle nullable value
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt ?? DateTime.MinValue
            }).ToList();
        }

        //public async Task<BlogPostDto?> GetByIdAsync(int id)
        //{
        //    var post = await _repository.GetByIdAsync(id);
        //    if (post == null) return null;
        //    return new BlogPostDto
        //    {
        //        AuthorId = post.AuthorId ?? 0, // Explicitly handle nullable value
        //        Title = post.Title,
        //        Content = post.Content,
        //        CreatedAt = post.CreatedAt ?? DateTime.MinValue
        //    };
        //}

        public async Task<BlogPost?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<int> CreateAsync(BlogPostDto dto)
        {
            var post = new BlogPost
            {
                AuthorId = dto.AuthorId,
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };
            return await _repository.CreateAsync(post);
        }

        public async Task<bool> UpdateAsync(int id, BlogPostDto dto)
        {
            var post = await _repository.GetByIdAsync(id);
            if (post == null) return false;

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.AuthorId = dto.AuthorId;
            post.UpdatedAt = DateTime.UtcNow;

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
    }
}