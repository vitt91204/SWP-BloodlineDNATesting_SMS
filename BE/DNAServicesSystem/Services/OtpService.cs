using System;
using System.Collections.Concurrent;

public class OtpService
{
    private readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();

    public string GenerateOtp(string email)
    {
        var otp = new Random().Next(100000, 999999).ToString();
        _otpStore[email] = (otp, DateTime.UtcNow.AddMinutes(5)); //Change expiry time in here
        Console.WriteLine($"[OTP DEBUG] Generated OTP for {email}: {otp}");
        return otp;
    }

    public bool VerifyOtp(string email, string otp)
    {
        if (_otpStore.TryGetValue(email, out var entry))
        {
            if (entry.Otp == otp && entry.Expiry > DateTime.UtcNow)
            {
                _otpStore.TryRemove(email, out _);
                return true;
            }
        }
        return false;
    }
}