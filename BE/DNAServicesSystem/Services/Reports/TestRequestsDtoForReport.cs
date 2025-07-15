using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Reports
{
    public class TestRequestsDtoForReport
    {
        public string UserFullName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;


        public string CollectionType { get; set; } = string.Empty;
    }
}
