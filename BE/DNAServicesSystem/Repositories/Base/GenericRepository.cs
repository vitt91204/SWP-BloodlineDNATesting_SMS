using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Data;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Base
{
    public class GenericRepository<T> where T : class
    {
        // This class can be extended to include common repository methods like Add, Update, Delete, GetById, etc.

        protected readonly AppDbContext context;

        public GenericRepository(AppDbContext context)
        {
            this.context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public GenericRepository()
        {
            context ??= new AppDbContext();
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
            var entity = context.Set<T>().Find(id);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }
        public T getById(string id)
        {
            var entity = context.Set<T>().Find(id);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }

        public async Task<T> getByIdAsync(string id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }
    }
}
