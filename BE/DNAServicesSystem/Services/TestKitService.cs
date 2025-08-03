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
                ServiceType = testKitDTO.ServiceType,
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
            existingTestKit.ServiceType = testKitDTO.ServiceType;
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
            await testKitRepository.UpdateAsync(testKit);
        }

        public async Task<TestKit> UpdateQuantityAsync(int kitId, int newQuantity)
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

            testKit.StockQuantity = newQuantity;

            if (testKit.StockQuantity <= 0)
            {
                testKit.StockQuantity = 0;
                testKit.IsActive = false;
            }

            await testKitRepository.UpdateAsync(testKit);
            return testKit;
        }

        public void ChangeQuantiy (int kitId, int changeQuantity)
        {
            if (kitId <= 0)
            {
                throw new ArgumentException("KitId must be a positive integer.", nameof(kitId));
            }
            var testKit = testKitRepository.GetById(kitId);
            if (testKit == null)
            {
                throw new KeyNotFoundException($"TestKit with ID {kitId} not found.");
            }

            testKit.StockQuantity += changeQuantity;

            if (testKit.StockQuantity <= 0)
            {
                testKit.StockQuantity = 0;
                testKit.IsActive = false;
            }
            testKitRepository.Update(testKit);
        }
    }
}
