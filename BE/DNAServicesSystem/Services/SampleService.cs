using Repositories;
using Services.SampleDTO;
using Repositories.Models;

namespace Services
{
    public class SampleService
    {
        private readonly SampleRepository _repository;
        public SampleService(SampleRepository repository) { _repository = repository; }

        public async Task<List<SampleDto>> GetAllAsync()
        {
            var samples = await _repository.GetAllAsync();
            return samples.Select(s => new SampleDto
            {
                SampleId = s.SampleId,
                RequestId = s.RequestId,
                CollectedBy = s.CollectedBy,
                CollectionTime = s.CollectionTime,
                ReceivedTime = s.ReceivedTime,
                Status = s.Status
            }).ToList();
        }

        public async Task<SampleDto?> GetByIdAsync(int id)
        {
            var s = await _repository.GetByIdAsync(id);
            if (s == null) return null;
            return new SampleDto
            {
                SampleId = s.SampleId,
                RequestId = s.RequestId,
                CollectedBy = s.CollectedBy,
                CollectionTime = s.CollectionTime,
                ReceivedTime = s.ReceivedTime,
                Status = s.Status
            };
        }

        public async Task<int> CreateAsync(SampleDto dto)
        {
            var entity = new Sample
            {
                RequestId = dto.RequestId,
                CollectedBy = dto.CollectedBy ?? throw new InvalidOperationException("CollectedBy cannot be null."),
                CollectionTime = dto.CollectionTime,
                ReceivedTime = dto.ReceivedTime,
                Status = dto.Status
            };
            return await _repository.CreateAsync(entity);
        }

        public async Task<bool> UpdateAsync(int id, SampleDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.RequestId = dto.RequestId;
            entity.CollectedBy = dto.CollectedBy ?? throw new InvalidOperationException("CollectedBy cannot be null.");
            entity.CollectionTime = dto.CollectionTime;
            entity.ReceivedTime = dto.ReceivedTime;
            entity.Status = dto.Status;

            await _repository.UpdateAsync(entity);
            return true;
        }
    }
}