using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

public class EmailService
{
    private readonly string _smtpServer = "smtp.gmail.com";
    private readonly int _smtpPort = 587;
    private readonly string _smtpUser = "nguyenbatuananh05@gmail.com"; //Use your Gmail address
    private readonly string _smtpPass = "e"; // Use App Password, not your Gmail password

    public async Task SendOtpAsync(string toEmail, string otp)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("DNAHealth", _smtpUser));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = "Your OTP Code";
        message.Body = new TextPart("plain")
        {
            Text = $"Your OTP code is: {otp}"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_smtpUser, _smtpPass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}