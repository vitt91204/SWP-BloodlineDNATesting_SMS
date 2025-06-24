namespace Services.SampleDTO
{
    public class SampleDto
    {
        public int SampleId { get; set; }
        public int RequestId { get; set; }
        public int? CollectedBy { get; set; }
        public DateTime? CollectionTime { get; set; }
        public DateTime? ReceivedTime { get; set; }
        public string? Status { get; set; }
    }
}