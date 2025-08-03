using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Reports
{
    public class RevenueReport
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal TotalRevenue { get; set; }


    }
}
