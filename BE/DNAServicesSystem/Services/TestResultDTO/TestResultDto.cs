namespace Services.TestResultDTO
{
    public class TestResultDto
    {
        public int ResultId { get; set; }
        public int SampleId { get; set; }
        public int RequestId { get; set; }
        public string? ResultData { get; set; }
        public int? UploadedBy { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? UploadedTime { get; set; }
        public DateTime? ApprovedTime { get; set; }
        public int? StaffId { get; set; }
    }
}