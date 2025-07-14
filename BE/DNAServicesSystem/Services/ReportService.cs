using Repositories.Models;
using Services.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ReportService
    {
        private readonly PaymentService paymentService;
        private readonly TestRequestService testRequestService;
        public ReportService() { 
            paymentService = new PaymentService(); 
            testRequestService = new TestRequestService();
        }


        public RevenueReport MonthlyRevenue(int year, int month)
        {
            if (year < 2000 || year > DateTime.Now.Year)
            {
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 2000 and the current year.");
            }

            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }

            var payments = paymentService.GetAllPaymentsAsync();

            RevenueReport report = new RevenueReport();

            foreach (var payment in payments.Result)
            {
                if (payment.PaidAt.HasValue && payment.PaidAt.Value.Year == year && payment.PaidAt.Value.Month == month)
                {
                    report.TotalRevenue += payment.Amount;
                }
            }

            report.Month = month;
            report.Year = year;
            return report;
        }

        public List<Payment> GetThisMonthPayments(int year, int month)
        {
            if (year < 2000 || year > DateTime.Now.Year)
            {
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 2000 and the current year.");
            }

            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }

            List<Payment> thisMonthPayments = new List<Payment>();

            var payments = paymentService.GetAllPaymentsAsync();

            foreach (var payment in payments.Result)
            {
                if (payment.PaidAt.HasValue && payment.PaidAt.Value.Year == year && payment.PaidAt.Value.Month == month)
                {
                    thisMonthPayments.Add(payment);
                }
            }

            if (thisMonthPayments.Count == 0)
            {
                throw new KeyNotFoundException($"No payments found for {month}/{year}.");
            }

            return thisMonthPayments;
        }

        public List<TestRequest> GetThisMonthRequests(int year, int month)
        {
            if (year < 2000 || year > DateTime.Now.Year)
            {
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 2000 and the current year.");
            }
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }
            List<TestRequest> thisMonthRequests = new List<TestRequest>();
            var requests = paymentService.GetAllPaymentsAsync();
            foreach (var request in requests.Result)
            {
                if (request.PaidAt.HasValue && request.PaidAt.Value.Year == year && request.PaidAt.Value.Month == month)
                {
                    thisMonthRequests.Add(request.Request);
                }
            }
            if (thisMonthRequests.Count == 0)
            {
                throw new KeyNotFoundException($"No requests found for {month}/{year}.");
            }
            return thisMonthRequests;
        }

        public int GetTotalMonthlyRequests(int year, int month)
        {
            if (year < 2000 || year > DateTime.Now.Year)
            {
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 2000 and the current year.");
            }
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }
            var requests = testRequestService.GetAllRequestsAsync();
            int totalRequests = requests.Result.Count(trs => 
                trs.CreatedAt.HasValue && 
                trs.CreatedAt.Value.Year == year && 
                trs.CreatedAt.Value.Month == month);
            return totalRequests;
        }

        public int GetDailyRequests(int year, int month, int day)
        {
            if (year < 2000 || year > DateTime.Now.Year)
            {
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be between 2000 and the current year.");
            }
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }
            if (day < 1 || day > DateTime.DaysInMonth(year, month))
            {
                throw new ArgumentOutOfRangeException(nameof(day), $"Day must be between 1 and {DateTime.DaysInMonth(year, month)} for the specified month.");
            }
            var requests = testRequestService.GetAllRequestsAsync();
            int dailyRequests = requests.Result.Count(trs => 
                trs.CreatedAt.HasValue && 
                trs.CreatedAt.Value.Year == year && 
                trs.CreatedAt.Value.Month == month && 
                trs.CreatedAt.Value.Day == day);
            return dailyRequests;
        }
    }
}
