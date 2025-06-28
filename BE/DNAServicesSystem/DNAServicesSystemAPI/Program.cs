using Microsoft.EntityFrameworkCore;
using Repositories;
using Services;


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
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<BlogPostRepository>();
            builder.Services.AddScoped<BlogPostService>();
            builder.Services.AddScoped<SubSampleRepository>();
            builder.Services.AddScoped<SubSampleService>();
            builder.Services.AddScoped<SampleRepository>();
            builder.Services.AddScoped<SampleService>();


            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


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
