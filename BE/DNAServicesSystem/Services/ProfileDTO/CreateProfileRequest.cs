namespace Services.ProfileDTO
{
    public class CreateProfileRequest
    {
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
}