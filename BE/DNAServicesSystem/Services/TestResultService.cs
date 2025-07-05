using Repositories;
using Services.TestResultDTO;
using Repositories.Models;

namespace Services
{
    public class TestResultService
    {
        private readonly TestResultRepository _repository;
        public TestResultService(TestResultRepository repository) { _repository = repository; }

        public async Task<List<TestResultDto>> GetAllAsync()
        {
            var results = await _repository.GetAllAsync();
            return results.Select(r => new TestResultDto
            {
                ResultId = r.ResultId,
                SampleId = r.SampleId ?? 0,
                UploadedBy = r.UploadedBy,
                ApprovedBy = r.ApprovedBy,
                UploadedTime = r.UploadedTime,
                ApprovedTime = r.ApprovedTime,
                StaffId = r.StaffId
            }).ToList();
        }

        public async Task<TestResultDto?> GetByIdAsync(int id)
        {
            var r = await _repository.GetByIdAsync(id);
            if (r == null) return null;
            return new TestResultDto
            {
                ResultId = r.ResultId,
                SampleId = r.SampleId ?? 0,
                UploadedBy = r.UploadedBy,
                ApprovedBy = r.ApprovedBy,
                UploadedTime = r.UploadedTime,
                ApprovedTime = r.ApprovedTime,
                StaffId = r.StaffId
            };
        }

        public async Task<int> CreateAsync(TestResultDto dto)
        {
            var entity = new TestResult
            {
                SampleId = dto.SampleId,
                UploadedBy = dto.UploadedBy,
                ApprovedBy = dto.ApprovedBy,
                UploadedTime = dto.UploadedTime,
                ApprovedTime = dto.ApprovedTime,
                StaffId = dto.StaffId
            };
            return await _repository.CreateAsync(entity);
        }

        public async Task<bool> UpdateAsync(int id, TestResultDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.SampleId = dto.SampleId;
            entity.UploadedBy = dto.UploadedBy;
            entity.ApprovedBy = dto.ApprovedBy;
            entity.UploadedTime = dto.UploadedTime;
            entity.ApprovedTime = dto.ApprovedTime;
            entity.StaffId = dto.StaffId;

            await _repository.UpdateAsync(entity);
            return true;
        }
    }
}