using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories;
using Repositories.Models;

namespace Services
{
    public class ServiceTypeService
    {
        private readonly ServiceTypeRepository serviceTypeRepository;

        sbyte[] serviceTypes = { 1, 2};
        public ServiceTypeService()
        {
            serviceTypeRepository = new ServiceTypeRepository();
        }

        public async Task<IEnumerable<ServiceType>> GetAllServiceTypesAsync()
        {
            // Simulate fetching service types from a repository
            return await serviceTypeRepository.GetAllAsync();
        }

        public async Task<ServiceType> GetServiceTypeByIdAsync(sbyte serviceTypeId)
        {
            if (serviceTypeId <= 0 || serviceTypeId > serviceTypes.Length)
            {
                throw new ArgumentOutOfRangeException(nameof(serviceTypeId), "Service type ID must be a valid positive number.");
            }
            // Simulate fetching a specific service type
            return await serviceTypeRepository.GetByIdAsync(serviceTypeId);
        }
    }
}
