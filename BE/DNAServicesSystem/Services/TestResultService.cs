using Repositories;
using Services.TestResultDTO;
using Repositories.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Org.BouncyCastle.Utilities;

namespace Services
{
    public class TestResultService
    {
        private readonly TestResultRepository _repository;
        private readonly TestRequestRepository _testRequestRepository;
        private readonly SampleRepository _sampleRepository;
        public TestResultService(TestResultRepository repository)
        {
            _repository = repository;
            _testRequestRepository = new TestRequestRepository();
            _sampleRepository = new SampleRepository();
        }

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
                StaffId = r.StaffId,
                IsMatch = r.IsMatch
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
                StaffId = r.StaffId,
                IsMatch = r.IsMatch
            };
        }

        public async Task<int> CreateAsync(TestResultDto dto)
        {
            var existingResult = await _repository.GetBySampleIdAsyncToList(dto.SampleId);
            if (existingResult != null && existingResult.Any())
            {
                throw new InvalidOperationException($"A test result for SampleId {dto.SampleId} already exists.");
            }

            var sample = await _sampleRepository.GetByIdAsync(dto.SampleId);
            if (sample == null)
            {
                throw new KeyNotFoundException($"Sample with ID {dto.SampleId} not found.");
            }

            var request = await _testRequestRepository.GetByIdAsync(sample.RequestId);
            if (request == null)
            {
                throw new KeyNotFoundException($"Test request with ID {sample.RequestId} not found.");
            }

            var entity = new TestResult
            {
                SampleId = dto.SampleId,
                UploadedBy = dto.UploadedBy,
                ApprovedBy = dto.ApprovedBy,
                UploadedTime = dto.UploadedTime,
                ApprovedTime = dto.ApprovedTime,
                StaffId = dto.StaffId,
                IsMatch = dto.IsMatch
            };

            // Update the request status to "Completed"
            request.Status = "Completed";
            await _testRequestRepository.UpdateAsync(request);
            await _sampleRepository.UpdateAsync(sample);

            return await _repository.CreateAsync(entity);
        }

        public async Task<int> CreateWithPdfAsync(ResultUploadRequest dto)
        {
            string? base64String = null;
            if (dto.PdfFile != null && dto.PdfFile.Length > 0)
            {
                if (!dto.PdfFile.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
                    throw new ArgumentException("Only PDF files are allowed.");

                using var ms = new MemoryStream();
                await dto.PdfFile.CopyToAsync(ms);
                base64String = Convert.ToBase64String(ms.ToArray());
            }

            var existingResult = await _repository.GetBySampleIdAsyncToList(dto.SampleId);
            if (existingResult != null && existingResult.Any())
            {
                throw new InvalidOperationException($"A test result for SampleId {dto.SampleId} already exists.");
            }

            var sample = await _sampleRepository.GetByIdAsync(dto.SampleId);
            if (sample == null)
            {
                throw new KeyNotFoundException($"Sample with ID {dto.SampleId} not found.");
            }

            var request = await _testRequestRepository.GetByIdAsync(sample.RequestId);
            if (request == null)
            {
                throw new KeyNotFoundException($"Test request with ID {sample.RequestId} not found.");
            }


            var entity = new TestResult
            {
                SampleId = dto.SampleId,
                UploadedBy = dto.UploadedBy,
                ApprovedBy = dto.UploadedBy,
                UploadedTime = DateTime.UtcNow,
                ApprovedTime = DateTime.UtcNow,
                StaffId = dto.StaffId,
                ResultData = base64String,
                IsMatch = dto.IsMatch
            };

            request.Status = "Completed";
            await _testRequestRepository.UpdateAsync(request);
            await _sampleRepository.UpdateAsync(sample);

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

        public async Task<bool> UploadPdfAsync(int resultId, IFormFile pdfFile)
        {
            if (pdfFile == null || pdfFile.Length == 0)
                return false;

            // Only allow PDF files
            if (!pdfFile.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
                return false;

            using var ms = new MemoryStream();
            await pdfFile.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64String = Convert.ToBase64String(fileBytes);

            var entity = await _repository.GetByIdAsync(resultId);
            if (entity == null)
                return false;

            entity.ResultData = base64String;
            await _repository.UpdateAsync(entity);
            return true;
        }

        public async Task<byte[]?> GetSampleResultPdfAsync(int sampleId)
        {
            var testResults = await _repository.GetBySampleIdAsyncToList(sampleId);
            if (testResults == null || !testResults.Any())
                return null;

            var testResult = testResults.FirstOrDefault(tr => !string.IsNullOrEmpty(tr.ResultData));
            if (testResult == null)
                return null;

            try
            {
                return Convert.FromBase64String(testResult.ResultData!);
            }
            catch
            {
                return null;
            }
        }
        public async Task<TestResult?> GetTestResultAsync(int sampleId)
        {
            var testResults = await _repository.GetBySampleIdAsyncToList(sampleId);
            if (testResults == null || !testResults.Any())
                return null;

            var testResult = testResults.FirstOrDefault(tr => !string.IsNullOrEmpty(tr.ResultData));
            if (testResult == null)
                return null;
            return testResult;
        }
    }
}