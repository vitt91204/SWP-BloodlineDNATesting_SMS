using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Attributes
{
     public class ExistingUser : ValidationAttribute
    {
        public ExistingUser() { }
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not int userId || userId <= 0)
            {
                return new ValidationResult("User ID must be a positive integer.");
            }
            var userService = (UserService)validationContext.GetService(typeof(UserService));
            if (userService == null)
            {
                return new ValidationResult("User service is not available.");
            }
            var user = userService.GetUserByIdAsync(userId).GetAwaiter().GetResult();
            if (user == null)
            {
                return new ValidationResult($"User with ID {userId} does not exist.");
            }
            return ValidationResult.Success;
        }
    }
}
