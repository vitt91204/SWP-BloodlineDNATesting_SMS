using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly EmailService _emailService;
    private readonly OtpService _otpService;

    public AuthController(OtpService otpService, EmailService emailService)
    {
        _otpService = otpService;
        _emailService = emailService;
    }

    [HttpPost("sendotp")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var otp = _otpService.GenerateOtp(request.Email);
        await _emailService.SendOtpAsync(request.Email, otp);
        return Ok("OTP sent to your email.");
    }

    [HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] OtpVerifyRequest request)
    {
        if (_otpService.VerifyOtp(request.Email, request.Otp))
        {
            return Ok("Email verified successfully.");
        }
        return BadRequest("Invalid or expired OTP.");
    }
}

public class RegisterRequest
{
    public string Email { get; set; }
}

public class OtpVerifyRequest
{
    public string Email { get; set; }
    public string Otp { get; set; }
}