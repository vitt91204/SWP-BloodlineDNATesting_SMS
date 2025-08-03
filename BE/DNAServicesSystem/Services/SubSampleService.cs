using Repositories;
using Services.SubSampleDTO;
using Repositories.Models;

namespace Services
{
    public class SubSampleService
    {
        private readonly SubSampleRepository _repository;
        public SubSampleService(SubSampleRepository repository) { _repository = repository; }

        public async Task<List<SubSampleDto>> GetAllAsync()
        {
            var subsamples = await _repository.GetAllAsync();
            return subsamples.Select(s => new SubSampleDto
            {
                SampleId = s.SampleId,
                Description = s.Description,
                CreatedAt = s.CreatedAt,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth ?? default,
                SampleType = s.SampleType
            }).ToList();
        }

        public async Task<SubSampleDto?> GetByIdAsync(int id)
        {
            var s = await _repository.GetByIdAsync(id);
            if (s == null) return null;
            return new SubSampleDto
            {
                SampleId = s.SampleId,
                Description = s.Description,
                CreatedAt = s.CreatedAt,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth ?? default,
                SampleType = s.SampleType
            };
        }

        public async Task<int> CreateAsync(SubSampleDto dto)
        {
            var entity = new SubSample
            {
                SampleId = dto.SampleId,
                Description = dto.Description,
                CreatedAt = dto.CreatedAt ?? DateTime.UtcNow,
                FullName = dto.FullName,
                DateOfBirth = dto.DateOfBirth == default ? null : dto.DateOfBirth,
                SampleType = dto.SampleType
            };
            return await _repository.CreateAsync(entity);
        }

        public async Task<bool> UpdateAsync(int id, SubSampleDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.SampleId = dto.SampleId;
            entity.Description = dto.Description;
            entity.CreatedAt = dto.CreatedAt ?? entity.CreatedAt;
            entity.FullName = dto.FullName;
            entity.DateOfBirth = dto.DateOfBirth == default ? entity.DateOfBirth : dto.DateOfBirth;
            entity.SampleType = dto.SampleType;

            await _repository.UpdateAsync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;
            return await _repository.RemoveAsync(entity);
        }
    }
}