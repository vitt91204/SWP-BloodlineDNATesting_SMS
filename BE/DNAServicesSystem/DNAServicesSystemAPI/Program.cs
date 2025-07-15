using Microsoft.EntityFrameworkCore;
using Repositories;
using Services;
using Services.VNPayService;
using Repositories.Base;
using Repositories.Models;


namespace DNAServicesSystemAPI
{
    public class Program
    {
        
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            
            //Dependency Injection for Services

            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<AddressService>();
            builder.Services.AddScoped<TestRequestService>();
            builder.Services.AddScoped<TestKitService>();
            builder.Services.AddScoped<FeedbackService>();
            builder.Services.AddScoped<TestServiceService>();
            builder.Services.AddScoped<BlogPostRepository>();
            builder.Services.AddScoped<BlogPostService>();
            builder.Services.AddScoped<SubSampleRepository>();
            builder.Services.AddScoped<SubSampleService>();
            builder.Services.AddScoped<SampleRepository>();
            builder.Services.AddScoped<SampleService>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<IVnPayService, PaymentService>();
            builder.Services.AddScoped<TestResultService>();
            builder.Services.AddScoped<TestResultRepository>();
            builder.Services.AddScoped<ReportService>();
            builder.Services.AddScoped<EmailService>();
            builder.Services.AddSingleton<OtpService>();

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "DNAServicesSystemAPI",
                    Version = "v1"
                });
            });


            var app = builder.Build();

            // Use CORS policy
            app.UseCors("AllowAll");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(); 
            }

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
