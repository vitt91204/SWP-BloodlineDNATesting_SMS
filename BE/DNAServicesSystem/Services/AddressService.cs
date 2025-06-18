using Repositories;
using Repositories.Models;
using Services.AddressDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class AddressService
    {
        private readonly AddressRepository addressRepository;

       public AddressService()
        {
           addressRepository =  new AddressRepository();
        }
        
        public async Task<Address> CreateAddress(CreateAddressRequest createAddressRequest)
        {
            var address = new Address
            {
                UserId = createAddressRequest.UserId,
                Label = createAddressRequest.Label,
                AddressLine = createAddressRequest.AddressLine,
                City = createAddressRequest.City,
                Province = createAddressRequest.Province,
                PostalCode = createAddressRequest.PostalCode,
                Country = createAddressRequest.Country,
                IsPrimary = createAddressRequest.IsPrimary,
                CreatedAt = DateTime.UtcNow
            };
            await addressRepository.CreateAsync(address);
            return address;
        }

        public async Task<Address?> GetAddressByUserId(int userId)
        {
            Address? address = await addressRepository.GetByIdAsync(userId);
            if (address == null)
            {
                throw new KeyNotFoundException($"Address for user with ID {userId} not found.");
            }
            if (address.UserId != userId)
            {
                throw new UnauthorizedAccessException($"User with ID {userId} does not have access to this address.");
            }
            return address;
        }

        public async Task<IEnumerable<Address>> GetAddressesByUserId(int userId)
        {
            var addresses = await addressRepository.GetAllAsync();
            return addresses.Where(a => a.UserId == userId);
        }

        public async Task DeleteAddressAsync(int addressId, int userId)
        {
            var address = await addressRepository.GetByIdAsync(addressId);
            if (address == null)
            {
                throw new KeyNotFoundException($"Address with ID {addressId} not found.");
            }
            if (address.UserId != userId)
            {
                throw new UnauthorizedAccessException($"User with ID {userId} does not have access to this address.");
            }
            await addressRepository.RemoveAsync(address);
        }

        public async Task<Address> UpdateAddressAsync(int addressId, CreateAddressRequest updateAddressRequest, int userId)
        {
            var address = await addressRepository.GetByIdAsync(addressId);
            if (address == null)
            {
                throw new KeyNotFoundException($"Address with ID {addressId} not found.");
            }
            if (address.UserId != userId)
            {
                throw new UnauthorizedAccessException($"User with ID {userId} does not have access to this address.");
            }
            address.Label = updateAddressRequest.Label;
            address.AddressLine = updateAddressRequest.AddressLine;
            address.City = updateAddressRequest.City;
            address.Province = updateAddressRequest.Province;
            address.PostalCode = updateAddressRequest.PostalCode;
            address.Country = updateAddressRequest.Country;
            address.IsPrimary = updateAddressRequest.IsPrimary;
            
            await addressRepository.UpdateAsync(address);
            return address;
        }

    }
}
