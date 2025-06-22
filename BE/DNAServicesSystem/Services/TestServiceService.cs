using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories;
using Repositories.Models;
using Services.TestServiceDTO;

namespace Services
{
    public class TestServiceService
    {
        private readonly TestServiceRepository testServiceRepository;   

        public TestServiceService()
        {
            testServiceRepository = new TestServiceRepository();
        }

        public async Task<TestService?> GetTestingServiceByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            }
            return await testServiceRepository.GetTestingServiceByNameAsync(name);
        }

        public async Task<TestService?> GetTestingServiceByIdAsync(int serviceId)
        {
            if (serviceId <= 0)
            {
                throw new ArgumentException("ServiceId must be a positive integer.", nameof(serviceId));
            }
            return await testServiceRepository.GetByIdAsync(serviceId);
        }

        public async Task<IEnumerable<TestService>> GetAllTestingServicesAsync()
        {
            return await testServiceRepository.GetAllAsync();
        }

        public async Task<TestService?> CreateTestingServiceAsync(TestServiceDto testServiceDTO)
        {
            if (testServiceDTO == null)
            {
                throw new ArgumentNullException(nameof(testServiceDTO), "TestServiceDto cannot be null.");
            }
            var testService = new TestService
            {
                Name = testServiceDTO.Name,
                Description = testServiceDTO.Description,
                Price = testServiceDTO.Price,
                IsActive = testServiceDTO.IsActive,
                KitId = testServiceDTO.KitId,
            };
            await testServiceRepository.CreateAsync(testService);
            return testService;
        }

        public async Task<TestService?> UpdateTestingServiceAsync(int serviceId, TestServiceDto testServiceDTO)
        {

            var existingService = await testServiceRepository.GetByIdAsync(serviceId);
            if (existingService == null)
            {
                throw new KeyNotFoundException($"No service found with ServiceId {serviceId}.");
            }
            existingService.Name = testServiceDTO.Name;
            existingService.Description = testServiceDTO.Description;
            existingService.Price = testServiceDTO.Price;
            existingService.IsActive = testServiceDTO.IsActive;
            existingService.KitId = testServiceDTO.KitId;
            await testServiceRepository.UpdateAsync(existingService);
            return existingService;
        }

        public async Task DeleteTestingServiceAsync(int serviceId)
        {
            if (serviceId <= 0)
            {
                throw new ArgumentException("ServiceId must be a positive integer.", nameof(serviceId));
            }
            var existingService = await testServiceRepository.GetByIdAsync(serviceId);
            if (existingService == null)
            {
                throw new KeyNotFoundException($"No service found with ServiceId {serviceId}.");
            }
            existingService.IsActive = false;
            await testServiceRepository.UpdateAsync(existingService);
        }

    }
}
