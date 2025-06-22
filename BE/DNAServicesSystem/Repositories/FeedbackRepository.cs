using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Data;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>
    {
        public FeedbackRepository()
        {

        }

        public async Task<List<Feedback>> GetFeedbackByUserIdAsync(int userId)
        {
            return await context.Feedbacks
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Feedback>> GetFeedbackByRequestIdAsync(int requestId)
        {
            return await context.Feedbacks
                .Where(f => f.RequestId == requestId)
                .ToListAsync();
        }
    }
}
