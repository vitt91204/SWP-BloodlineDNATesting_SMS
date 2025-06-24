namespace Services.SubSampleDTO
{
    public class SubSampleDto
    {
        public int SubSampleId { get; set; }
        public int SampleId { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}