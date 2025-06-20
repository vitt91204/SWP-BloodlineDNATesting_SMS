using Repositories.Base;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class AddressRepository : GenericRepository<Address>
    {
        public AddressRepository()
        {
            // Default constructor initializes the context
        }

        public async Task<Address?> GetByAddressIdAsync(int addressId)
        {
            return await context.Addresses.FindAsync(addressId);
        }
    }
}
