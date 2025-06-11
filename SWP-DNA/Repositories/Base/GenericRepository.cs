using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Data;

namespace Repositories.Base
{
    public class GenericRepository<T> where T : class
    {
        protected AppDBContext context;
        public GenericRepository()
        {
            context ??= new AppDBContext();
        }

        public GenericRepository(AppDBContext context)
        {
            this.context = context ?? throw new ArgumentNullException(nameof(context));
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
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Set<T>().Add(entity);
            context.SaveChanges();
        }

        public async Task<int> CreateAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Add(entity);
            return await context.SaveChangesAsync();
        }

        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Set<T>().Update(entity);
            context.SaveChanges();
        }

        public async Task<int> UpdateAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Set<T>().Update(entity);
            return await context.SaveChangesAsync();
        }

        public bool Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Set<T>().Remove(entity);
            context.SaveChanges();
            return true;
        }

        public async Task<bool> DeleteAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            context.Set<T>().Remove(entity);
            await context.SaveChangesAsync();
            return true;
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

        public T GetById(string id)
        {
            var entity = context.Set<T>().Find(id);
            if (entity != null)
            {
                context.Entry(entity).State = EntityState.Detached;
            }
            return entity;
        }

        public async Task<T> GetByIdAsync(string id)
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
