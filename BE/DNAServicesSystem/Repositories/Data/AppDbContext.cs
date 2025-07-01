using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositories.Models;
using System;
using System.Collections.Generic;

namespace Repositories.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<ResultDatum> ResultData { get; set; }

    public virtual DbSet<Sample> Samples { get; set; }

    public virtual DbSet<SubSample> SubSamples { get; set; }

    public virtual DbSet<TestKit> TestKits { get; set; }

    public virtual DbSet<TestRequest> TestRequests { get; set; }

    public virtual DbSet<TestResult> TestResults { get; set; }

    public virtual DbSet<TestService> TestServices { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public static string GetConnectionString(string connectionStringName)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();
        string connectionString = config.GetConnectionString(connectionStringName);
        return connectionString;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder.UseSqlServer(GetConnectionString("DefaultConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("PK__Address__CAA247C80F6A1875");

            entity.ToTable("Address");

            entity.Property(e => e.AddressId).HasColumnName("address_id");
            entity.Property(e => e.AddressLine)
                .HasColumnType("text")
                .HasColumnName("address_line");
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("country");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsPrimary)
                .HasDefaultValue(false)
                .HasColumnName("is_primary");
            entity.Property(e => e.Label)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("label");
            entity.Property(e => e.PostalCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("postal_code");
            entity.Property(e => e.Province)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("province");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Address__user_id__52593CB8");
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__3ED787669801A851");

            entity.ToTable("BlogPost");

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.AuthorId).HasColumnName("author_id");
            entity.Property(e => e.Content)
                .HasColumnType("text")
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__BlogPost__author__7B5B524B");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__7A6B2B8C28995763");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.Comment)
                .HasColumnType("text")
                .HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.RespondedAt)
                .HasColumnType("datetime")
                .HasColumnName("responded_at");
            entity.Property(e => e.Response)
                .HasColumnType("text")
                .HasColumnName("response");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Request).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__reques__76969D2E");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__user_i__75A278F5");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__ED1FC9EA14D40119");

            entity.ToTable("Payment");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.Method)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("method");
            entity.Property(e => e.PaidAt)
                .HasColumnType("datetime")
                .HasColumnName("paid_at");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Token)
                .HasMaxLength(100)
                .HasColumnName("token");

            entity.HasOne(d => d.Request).WithMany(p => p.Payments)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payment__request__02FC7413");
        });

        modelBuilder.Entity<ResultDatum>(entity =>
        {
            entity.HasKey(e => e.ResultDataId).HasName("PK__ResultDa__D07B4EE786AAD9D2");

            entity.Property(e => e.ResultDataId).HasColumnName("Result_data_id");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .HasColumnName("file_name");
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .HasColumnName("file_path");
        });

        modelBuilder.Entity<Sample>(entity =>
        {
            entity.HasKey(e => e.SampleId).HasName("PK__Sample__84ACF7BAFE897FC3");

            entity.ToTable("Sample");

            entity.Property(e => e.SampleId).HasColumnName("sample_id");
            entity.Property(e => e.CollectedBy).HasColumnName("collected_by");
            entity.Property(e => e.CollectionTime)
                .HasColumnType("datetime")
                .HasColumnName("collection_time");
            entity.Property(e => e.ReceivedTime)
                .HasColumnType("datetime")
                .HasColumnName("received_time");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");

            entity.HasOne(d => d.CollectedByNavigation).WithMany(p => p.Samples)
                .HasForeignKey(d => d.CollectedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Sample__collecte__6754599E");

            entity.HasOne(d => d.Request).WithMany(p => p.Samples)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Sample__request___66603565");
        });

        modelBuilder.Entity<SubSample>(entity =>
        {
            entity.HasKey(e => e.SubSampleId).HasName("PK__SubSampl__F53F8AF35E917162");

            entity.ToTable("SubSample");

            entity.Property(e => e.SubSampleId).HasColumnName("sub_sample_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.SampleId).HasColumnName("sample_id");

            entity.HasOne(d => d.Sample).WithMany(p => p.SubSamples)
                .HasForeignKey(d => d.SampleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SubSample__sampl__7F2BE32F");
        });

        modelBuilder.Entity<TestKit>(entity =>
        {
            entity.HasKey(e => e.KitId).HasName("PK__TestKit__7B21C6978958BBD2");

            entity.ToTable("TestKit");

            entity.Property(e => e.KitId).HasColumnName("kit_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.StockQuantity)
                .HasDefaultValue(0)
                .HasColumnName("stock_quantity");
        });

        modelBuilder.Entity<TestRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__TestRequ__18D3B90FDE0EC2F0");

            entity.ToTable("TestRequest");

            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.AddressId).HasColumnName("address_id");
            entity.Property(e => e.AppointmentDate).HasColumnName("appointment_date");
            entity.Property(e => e.CollectionType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("collection_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ServiceId).HasColumnName("service_id");
            entity.Property(e => e.SlotTime).HasColumnName("slot_time");
            entity.Property(e => e.StaffId).HasColumnName("staff_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Address).WithMany(p => p.TestRequests)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK__TestReque__addre__628FA481");

            entity.HasOne(d => d.Service).WithMany(p => p.TestRequests)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestReque__servi__60A75C0F");

            entity.HasOne(d => d.Staff).WithMany(p => p.TestRequestStaffs)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__TestReque__staff__619B8048");

            entity.HasOne(d => d.User).WithMany(p => p.TestRequestUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestReque__user___5FB337D6");
        });

        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__TestResu__AFB3C316337BDE1E");

            entity.ToTable("TestResult");

            entity.Property(e => e.ResultId).HasColumnName("result_id");
            entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");
            entity.Property(e => e.ApprovedTime)
                .HasColumnType("datetime")
                .HasColumnName("approved_time");
            entity.Property(e => e.RequestId).HasColumnName("request_id");
            entity.Property(e => e.ResultDataId).HasColumnName("Result_data_id");
            entity.Property(e => e.SampleId).HasColumnName("sample_id");
            entity.Property(e => e.StaffId).HasColumnName("staff_id");
            entity.Property(e => e.UploadedBy).HasColumnName("uploaded_by");
            entity.Property(e => e.UploadedTime)
                .HasColumnType("datetime")
                .HasColumnName("uploaded_time");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.TestResultApprovedByNavigations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK__TestResul__appro__6EF57B66");

            entity.HasOne(d => d.Request).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__TestResul__reque__6D0D32F4");

            entity.HasOne(d => d.ResultData).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.ResultDataId)
                .HasConstraintName("FK__TestResul__Resul__70DDC3D8");

            entity.HasOne(d => d.Sample).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.SampleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestResul__sampl__6C190EBB");

            entity.HasOne(d => d.Staff).WithMany(p => p.TestResultStaffs)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__TestResul__staff__6FE99F9F");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.TestResultUploadedByNavigations)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK__TestResul__uploa__6E01572D");
        });

        modelBuilder.Entity<TestService>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__TestServ__3E0DB8AFCC5B8259");

            entity.ToTable("TestService");

            entity.Property(e => e.ServiceId).HasColumnName("service_id");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.KitId).HasColumnName("kit_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");

            entity.HasOne(d => d.Kit).WithMany(p => p.TestServices)
                .HasForeignKey(d => d.KitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestServi__kit_i__59FA5E80");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370FEC8B8E28");

            entity.ToTable("User");

            entity.HasIndex(e => e.Username, "UQ__User__F3DBC57253448A29").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("full_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
