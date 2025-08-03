using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.TestResultDTO
{
    public class ResultUploadRequest
    {

        [Required]
        public int SampleId { get; set; }

        public int? UploadedBy { get; set; }
        public int? StaffId { get; set; }
        public IFormFile? PdfFile { get; set; }

    }
}
