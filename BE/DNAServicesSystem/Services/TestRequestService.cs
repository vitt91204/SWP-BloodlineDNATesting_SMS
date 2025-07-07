using Repositories;
using Repositories.Models;
using Services.TestRequestDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class TestRequestService
    {
        private readonly TestRequestReposity testRequestReposity;

        public TestRequestService()
        {
            testRequestReposity = new TestRequestReposity();
        }

        public async Task<TestRequest> CreateTestRequestAsync(TestRequestDto testRequestDto)
        {
            if (testRequestDto == null)
            {
                throw new ArgumentNullException(nameof(testRequestDto), "Test request data cannot be null.");
            }

            var testRequest = new TestRequest
            {
                UserId = testRequestDto.UserId,
                ServiceId = testRequestDto.ServiceId,
                CollectionType = testRequestDto.CollectionType,
                Status = testRequestDto.Status,
                AppointmentDate = testRequestDto.AppointmentDate,
                SlotTime = testRequestDto.SlotTime,
                StaffId = testRequestDto.StaffId
            };
            await testRequestReposity.CreateAsync(testRequest);
            return testRequest;
        }

        public async Task<TestRequest> GetRequestAsync(int requestId)
        {
            var testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }

            return testRequest;
        }

        public async Task<IEnumerable<TestRequest>> GetAllRequestsAsync()
        {
            return await testRequestReposity.GetAllAsync();
        }
       

        public async Task<IEnumerable<TestRequest>> GetTestRequestsByUserIdAsync(int userId)
        {
            return await testRequestReposity.GetRequestsByUserIdAsync(userId);
        }

        public async Task<IEnumerable<TestRequest>> GetTestRequestsByServiceIdAsync(int serviceId)
        {
            return await testRequestReposity.GetRequestsByServiceIdAsync(serviceId);
        }

        public async Task<TestRequest> UpdateTestRequestAsync(int requestId, TestRequestDto testRequestDto)
        {
            var testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }
            testRequest.UserId = testRequestDto.UserId;
            testRequest.ServiceId = testRequestDto.ServiceId;
            testRequest.CollectionType = testRequestDto.CollectionType;
            testRequest.Status = testRequestDto.Status;
            testRequest.AppointmentDate = testRequestDto.AppointmentDate;
            testRequest.SlotTime = testRequestDto.SlotTime;
            testRequest.StaffId = testRequestDto.StaffId;
            await testRequestReposity.UpdateAsync(testRequest);
            return testRequest;
        }

        public async Task DeleteTestRequestAsync(int requestId)
        {
            var testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }
            await testRequestReposity.RemoveAsync(testRequest);
        }

        public async Task<TestRequest> UpdateStaffRequestAsync(int requestId, int staffId)
        {
            var testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }

            if (staffId <= 0)
            {
                throw new Exception($"{staffId} is not a legitmate ID");
            }
            testRequest.StaffId = staffId;
            await testRequestReposity.UpdateAsync(testRequest);
            return testRequest;
        }

    }

}
