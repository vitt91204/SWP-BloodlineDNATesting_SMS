using Org.BouncyCastle.Asn1;
using Repositories;
using Repositories.Models;
using Services.Reports;
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
        private readonly TestRequestRepository testRequestReposity;
        private readonly UserRepository userRepository;
        private readonly SampleRepository sampleRepository;
        private readonly SubSampleRepository subSampleRepository;
        private readonly TestServiceRepository serviceRepository;
        private readonly PaymentRepository paymentRepository;
        private readonly TestKitRepository testKitRepository;

        public TestRequestService()
        {
            testRequestReposity = new TestRequestRepository();
            userRepository = new UserRepository();
            sampleRepository = new SampleRepository();
            subSampleRepository = new SubSampleRepository();
            serviceRepository = new TestServiceRepository();
            paymentRepository = new PaymentRepository();
            testKitRepository = new TestKitRepository();
        }

        public async Task<TestRequest> CreateTestRequestAsync(AppointmentTestRequestDto testRequestDto)
        {
            if (testRequestDto == null)
            {
                throw new ArgumentNullException(nameof(testRequestDto), "Test request data cannot be null.");
            }

            TestKitService testKitService = new TestKitService();
            testKitService.ChangeQuantiy(serviceRepository.GetByIdAsync(testRequestDto.ServiceId).Result.KitId, -1);
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

        public async Task<TestRequest> CreateTestRequestAsync(RequestTestDto testRequestDTO)
        {
            if (testRequestDTO == null)
            {
                throw new ArgumentNullException(nameof(testRequestDTO), "Test request data cannot be null.");
            }
            var testRequest = new TestRequest
            {
                UserId = testRequestDTO.UserId,
                ServiceId = testRequestDTO.ServiceId,
                CollectionType = testRequestDTO.CollectionType,
                Status = testRequestDTO.Status,
                AppointmentDate = DateOnly.FromDateTime(DateTime.Now),
                SlotTime = TimeOnly.FromDateTime(DateTime.Now),
                StaffId = testRequestDTO.StaffId
            };
            await testRequestReposity.CreateAsync(testRequest);
            return testRequest;
        }

        #region GetRequests
        public async Task<TestRequest> GetRequestAsync(int requestId)
        {
            var testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }

            return testRequest;
        }

        public async Task<IEnumerable<RequestDetailsDto>> GetAllRequestsAsync()
        {
            List<TestRequest> testRequestList =  await testRequestReposity.GetAllAsync();

            if (testRequestList == null || !testRequestList.Any())
            {
                throw new KeyNotFoundException("No test requests found.");
            }

            List<RequestDetailsDto> requestDetails = new List<RequestDetailsDto>();
            foreach (var request in testRequestList)
            {
                var user = await userRepository.GetByIdAsync(request.UserId);
                var service = await serviceRepository.GetByIdAsync(request.ServiceId);
                Sample sample = await sampleRepository.GetSampleByRequestidAsync(request.RequestId);
                List<SubSample>? subSamples = null;
                if (sample != null)
                {
                    subSamples = await subSampleRepository.GetSubSamplesBySampleIdAsync(sample.SampleId);
                }
                requestDetails.Add(new RequestDetailsDto
                {
                    RequestId = request.RequestId,
                    UserFullName = user.FullName,
                    ServiceName = service.Name,
                    UserId = request.UserId,
                    ServiceId = request.ServiceId,
                    CollectionType = request.CollectionType,
                    Status = request.Status,
                    AppointmentDate = request.AppointmentDate,
                    SlotTime = request.SlotTime,
                    StaffId = request.StaffId,
                    UserPhoneNumber = user.Phone,
                    CreatedAt = request.CreatedAt,
                });
            }
            return requestDetails;
        }
       

        public async Task<IEnumerable<TestHistoryDto>> GetTestRequestsByUserIdAsync(int userId)
        {
            var requests = await testRequestReposity.GetRequestsByUserIdAsync(userId);

            if (requests == null || !requests.Any())
            {
                throw new KeyNotFoundException($"No test requests found for staff ID {userId}.");
            }

            List<TestHistoryDto> requestDetails = new List<TestHistoryDto>();

            foreach (var request in requests)
            {
                var user = await userRepository.GetByIdAsync(request.UserId);
                var service = await serviceRepository.GetByIdAsync(request.ServiceId);
                Sample sample = await sampleRepository.GetSampleByRequestidAsync(request.RequestId);
                List<SubSample>? subSamples = null;
                if (sample != null)
                {
                    subSamples = await subSampleRepository.GetSubSamplesBySampleIdAsync(sample.SampleId);
                }
                Payment? payment = await paymentRepository.GetPaymentByRequestIdAsync(request.RequestId);
                requestDetails.Add(new TestHistoryDto
                {
                    RequestId = request.RequestId,
                    UserFullName = user.FullName,
                    ServiceName = service.Name,
                    UserId = request.UserId,
                    ServiceId = request.ServiceId,
                    CollectionType = request.CollectionType,
                    Status = request.Status,
                    AppointmentDate = request.AppointmentDate,
                    SlotTime = request.SlotTime,
                    StaffId = request.StaffId,
                    Sample = sample ?? null,
                    SubSamples = subSamples ?? null,
                    Payment = payment ?? null
                });
            }
            return requestDetails;
        }

        public async Task<IEnumerable<RequestDetailsDto>> GetTestRequestsByStaffIdAsync(int staffId)
        {
            var requests = await testRequestReposity.GetRequestsByStaffIdAsync(staffId);

            if (requests == null || !requests.Any())
            {
                throw new KeyNotFoundException($"No test requests found for staff ID {staffId}.");
            }

            List<RequestDetailsDto> requestDetails = new List<RequestDetailsDto>();

            foreach (var request in requests)
            {
                var user = await userRepository.GetByIdAsync(request.UserId);
                var service = await serviceRepository.GetByIdAsync(request.ServiceId);
                Sample sample = await sampleRepository.GetSampleByRequestidAsync(request.RequestId);
                List<SubSample>? subSamples = null;
                if (sample != null)
                {
                    subSamples = await subSampleRepository.GetSubSamplesBySampleIdAsync(sample.SampleId);
                }
                requestDetails.Add(new RequestDetailsDto
                {
                    RequestId = request.RequestId,
                    UserFullName = user.FullName,
                    ServiceName = service.Name,
                    UserId = request.UserId,
                    ServiceId = request.ServiceId,
                    CollectionType = request.CollectionType,
                    Status = request.Status,
                    AppointmentDate = request.AppointmentDate,
                    SlotTime = request.SlotTime,
                    StaffId = request.StaffId,
                    Sample = sample ?? null,
                    SubSamples = subSamples ?? null
                });
            }
            return requestDetails;
        }

        #endregion

        public async Task<TestRequest> UpdateTestRequestAsync(int requestId, AppointmentTestRequestDto testRequestDto)
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

            var user = await userRepository.GetByIdAsync(staffId);
            if (user == null)
            {
                throw new Exception($" User {staffId} does not exist");
            }

            if (user.Role != "Staff")
            {
                throw new Exception($"Cannot assign non-Staff user!");
            }
            testRequest.StaffId = user.UserId;
            await testRequestReposity.UpdateAsync(testRequest);
            return testRequest;
        }

        public async Task<bool> UpdateStatus (int requestId, string status)
        {
            TestRequest testRequest = await testRequestReposity.GetByIdAsync(requestId);
            if (testRequest == null)
            {
                throw new KeyNotFoundException($"Test request with ID {requestId} not found.");
            }
            testRequest.Status = status;
            await testRequestReposity.UpdateAsync(testRequest);
            return true;
        }


    }

}
