using Repositories;
using Services.SampleDTO;
using Repositories.Models;


namespace Services
{
    public class SampleService
    {
        private readonly SampleRepository _repository;
        private readonly TestRequestRepository _testRequestRepository;
        public SampleService(SampleRepository repository) 
        { 
            _repository = repository; 
            _testRequestRepository = new TestRequestRepository();
        }

        public async Task<List<Sample>> GetAllAsync()
        {
            var samples = await _repository.GetAllAsync();
            return samples;
        }

        public async Task<Sample?> GetByIdAsync(int id)
        {
            var s = await _repository.GetByIdAsync(id);
            if (s == null) return null;
            return s;
        }

        public async Task<int> CreateAsync(SampleDto dto)
        {
            var existingSample = await _repository.GetSampleByRequestidAsync(dto.RequestId);
            if (existingSample != null)
            {
                throw new InvalidOperationException($"A sample with RequestId {dto.RequestId} already exists.");
            }

            TestRequest? request = await _testRequestRepository.GetByIdAsync(dto.RequestId);
            if (request == null)
            {
                throw new KeyNotFoundException($"Test request with ID {dto.RequestId} not found.");
            }

            var entity = new Sample
            {
                RequestId = dto.RequestId,
                CollectedBy = dto.CollectedBy,
                CollectionTime = dto.CollectionTime,
                ReceivedTime = dto.ReceivedTime,
                Status = dto.Status,
                SampleType = dto.SampleType,
                Relationship = dto.Relationship
            };

            request.Status = "Collected";
            await _testRequestRepository.UpdateAsync(request);

            return await _repository.CreateAsync(entity);
        }

        public async Task<bool> UpdateAsync(int id, SampleDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.RequestId = dto.RequestId;
            entity.CollectedBy = dto.CollectedBy;
            entity.CollectionTime = dto.CollectionTime;
            entity.ReceivedTime = dto.ReceivedTime;
            entity.Status = dto.Status;
            entity.SampleType = dto.SampleType;
            entity.Relationship = dto.Relationship;

            await _repository.UpdateAsync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;
            return await _repository.RemoveAsync(entity);
        }

        public async Task<List<Sample>> SearchSamplesAsync(string? serviceName, string? userFullName)
        {
            var samples = await _repository.SearchSamplesAsync(serviceName, userFullName);
            return samples;
        }
    }
}