using Repositories;
using Services.SampleDTO;
using Repositories.Models;

namespace Services
{
    public class SampleService
    {
        private readonly SampleRepository _repository;
        public SampleService(SampleRepository repository) { _repository = repository; }

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
    }
}