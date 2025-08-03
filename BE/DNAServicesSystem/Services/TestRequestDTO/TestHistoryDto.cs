using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.TestRequestDTO
{
    public class TestHistoryDto : RequestDetailsDto
    {
        public Payment? Payment { get; set; }
    }
}
