using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories;
using Repositories.Models;
using Services.TestKitDTO;

namespace Services
{
    public class TestKitService
    {
        private readonly TestKitRepository testKitRepository;

        public TestKitService()
        {
            testKitRepository = new TestKitRepository();
        }

        public async Task<TestKit?> GetTestKitByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            }
            return await testKitRepository.GetTestKitByNameAsync(name);
        }
        public async Task<TestKit?> GetTestKitByIdAsync(int kitId)
        {
            if (kitId <= 0)
            {
                throw new ArgumentException("KitId must be a positive integer.", nameof(kitId));
            }
            return await testKitRepository.GetByIdAsync(kitId);
        }

        public async Task<IEnumerable<TestKit>> GetAllTestKitsAsync()
        {
            return await testKitRepository.GetAllAsync();
        }

        public async Task<TestKit?> CreateTestKitAsync(TestKitDto testKitDTO)
        {
            if (testKitDTO == null)
            {
                throw new ArgumentNullException(nameof(testKitDTO), "TestKitDto cannot be null.");
            }
            var testKit = new TestKit
            {
                Name = testKitDTO.Name,
                Description = testKitDTO.Description,
                StockQuantity = testKitDTO.StockQuantity,
                IsActive = testKitDTO.IsActive,
            };
            await testKitRepository.CreateAsync(testKit);
            return testKit;

        }

        public async Task<TestKit?> UpdateTestKitAsync(int kitId, TestKitDto testKitDTO)
        {
            if (kitId <= 0)
            {
                throw new ArgumentException("KitId must be a positive integer.", nameof(kitId));
            }
            if (testKitDTO == null)
            {
                throw new ArgumentNullException(nameof(testKitDTO), "TestKitDto cannot be null.");
            }
            var existingTestKit = await testKitRepository.GetByIdAsync(kitId);
            if (existingTestKit == null)
            {
                throw new KeyNotFoundException($"TestKit with ID {kitId} not found.");
            }
            existingTestKit.Name = testKitDTO.Name;
            existingTestKit.Description = testKitDTO.Description;
            existingTestKit.StockQuantity = testKitDTO.StockQuantity;
            existingTestKit.IsActive = testKitDTO.IsActive;
            await testKitRepository.UpdateAsync(existingTestKit);
            return existingTestKit;
        }
        public async Task DeleteTestKitAsync(int kitId)
        {
            if (kitId <= 0)
            {
                throw new ArgumentException("KitId must be a positive integer.", nameof(kitId));
            }
            var testKit = await testKitRepository.GetByIdAsync(kitId);
            if (testKit == null)
            {
                throw new KeyNotFoundException($"TestKit with ID {kitId} not found.");
            }
            testKit.IsActive = false;
            await testKitRepository.UpdateAsync(testKit);// Soft delete by marking as inactive
        }
    }
}
