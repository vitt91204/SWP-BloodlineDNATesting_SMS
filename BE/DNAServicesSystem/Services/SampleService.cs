using Repositories;
using Services.SampleDTO;
using Repositories.Models;


namespace Services
{
    public class SampleService
    {
        private readonly SampleRepository _repository;
        private readonly TestRequestRepository _testRequestRepository;
        private readonly UserRepository _userRepository;
        private readonly TestServiceRepository _testServiceRepository;
        public SampleService(SampleRepository repository) 
        { 
            _repository = repository; 
            _testRequestRepository = new TestRequestRepository();
            _userRepository = new UserRepository();
            _testServiceRepository = new TestServiceRepository();
        }

        public async Task<IEnumerable<SampleDetailsDto>> GetAllAsync()
        {
            List<Sample> samples = await _repository.GetAllAsync();

            var sampleDetails = new List<SampleDetailsDto>();

            foreach (var sample in samples)
            {
                var request = await _testRequestRepository.GetByIdAsync(sample.RequestId);
                var user = await _userRepository.GetByIdAsync(request.UserId);
                var service = await _testServiceRepository.GetByIdAsync(request.ServiceId);
                sampleDetails.Add(
                    new SampleDetailsDto
                    {
                        SampleId = sample.SampleId,
                        RequestId = sample.RequestId,
                    CollectedBy = sample.CollectedBy,
                    ReceivedTime = sample.ReceivedTime,
                    Status = sample.Status,
                    SampleType = sample.SampleType,
                    ServiceName = service.Name,
                    UserFullName = user.FullName,
                    UserPhoneNumber = user.Phone
                });

            }
            return sampleDetails;
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
                ReceivedTime = dto.ReceivedTime,
                Status = dto.Status,
                SampleType = dto.SampleType,
            };

            request.Status = "Testing";
            await _testRequestRepository.UpdateAsync(request);

            return await _repository.CreateAsync(entity);
        }

        public async Task<bool> UpdateAsync(int id, SampleDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.RequestId = dto.RequestId;
            entity.CollectedBy = dto.CollectedBy;
            entity.ReceivedTime = dto.ReceivedTime;
            entity.Status = dto.Status;
            entity.SampleType = dto.SampleType;

            await _repository.UpdateAsync(entity);
            return true;
        }

        public async Task<bool> UpdateStatusAsync(int id, string status)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.Status = status;
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