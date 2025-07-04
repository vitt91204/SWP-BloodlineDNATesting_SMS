using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceTypeController : ControllerBase
    {
        private readonly ServiceTypeService serviceTypeService;

        public ServiceTypeController(ServiceTypeService serviceTypeService)
        {
            this.serviceTypeService = serviceTypeService;
        }

        [HttpGet("all-service-types")]
        public async Task<IActionResult> GetAllServiceTypes()
        {
            try
            {
                var serviceTypes = await serviceTypeService.GetAllServiceTypesAsync();
                return Ok(serviceTypes);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving service types: {ex.Message}");
            }
        }

        [HttpGet("{serviceTypeId:int}")]
        public async Task<IActionResult> GetServiceTypeById(sbyte serviceTypeId)
        {
            try
            {
                var serviceType = await serviceTypeService.GetServiceTypeByIdAsync(serviceTypeId);
                return Ok(serviceType);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving service type: {ex.Message}");
            }
        }
    }
}
