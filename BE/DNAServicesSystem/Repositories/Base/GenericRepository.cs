using Microsoft.EntityFrameworkCore;
using Repositories.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Base
{
    public class GenericRepository<T> where T : class
    {
        protected AppDbContext context;

        public GenericRepository()
        {
            context ??= new AppDbContext();
        }

        public GenericRepository(AppDbContext context)
        {
            this.context = context;
        }

        public List<T> GetAll()
        {
            return context.Set<T>().ToList();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        public void Create(T entity)
        {
            context.Add(entity);
            context.SaveChanges();
        }

        public async Task<int> CreateAsync(T entity)
        {
            context.Add(entity);
            return await context.SaveChangesAsync();
        }
        public void Update(T entity)
        {
            var tracker = context.Attach(entity);
            tracker.State = EntityState.Modified;
            context.SaveChanges();
        }
        public void Delete(T entity)
        {
            context.Remove(entity);
            context.SaveChanges();
        }

        public async Task<int> UpdateAsync(T entity)
        {
            var tracker = context.Attach(entity);
            tracker.State = EntityState.Modified;
            return await context.SaveChangesAsync();
        }

        public bool Remove(T entity)
        {
            context.Remove(entity);
            return context.SaveChanges() > 0;
        }

        public async Task<bool> RemoveAsync(T entity)
        {
            context.Remove(entity);
            return await context.SaveChangesAsync() > 0;
        }

        public T GetById(int id)
        {
            return context.Set<T>().Find(id);
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

       
    }
}
