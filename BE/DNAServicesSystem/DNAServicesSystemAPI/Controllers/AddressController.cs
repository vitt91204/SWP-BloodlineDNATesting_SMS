using Microsoft.AspNetCore.Mvc;
using Services;
using Services.AddressDTO;

namespace DNAServicesSystemAPI.Controllers
{
    public class AddressController : Controller
    {
        private readonly AddressService addressService;

        public AddressController(AddressService addressService)
        {
            this.addressService = addressService;
        }

        [HttpGet]
        [Route("api/addresses/{userId:int}")]
        public async Task<IActionResult> GetAllAddresses(int userId)
        {
            var addresses = await addressService.GetAddressesByUserId(userId);
            return Ok(addresses);
        }

        [HttpGet]
        public async Task<IActionResult> GetAddressByUserId(int userId)
        {
            try
            {
                var address = await addressService.GetAddressByUserId(userId);
                return Ok(address);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/addresses/{userId:int}")]

        public async Task<IActionResult> CreateAddress([FromBody] CreateAddressRequest createAddressRequest, int userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var address = await addressService.CreateAddress(createAddressRequest, userId);
                return CreatedAtAction(nameof(GetAddressById), new { addressId = address.AddressId, userId = userId }, address);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/addresses/{addressId:int}/{userId:int}")]
        public async Task<IActionResult> GetAddressById(int addressId, int userId)
        {
            try
            {
                var address = await addressService.GetAddressByIdAsync(addressId, userId);
                return Ok(address);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }

        }
        [HttpDelete]
        [Route("api/addresses/{addressId:int}/{userId:int}")]
        public async Task<IActionResult> DeleteAddress(int addressId, int userId)
        {
            try
            {
                await addressService.DeleteAddressAsync(addressId, userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
        [HttpPut]
        [Route("api/addresses/{addressId:int}/{userId:int}")]

        public async Task<IActionResult> UpdateAddress(int addressId, int userId, [FromBody] CreateAddressRequest updateAddressRequest)
        {
            try
            {
                var address = await addressService.UpdateAddressAsync(addressId, updateAddressRequest, userId);
                return Ok(address);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
