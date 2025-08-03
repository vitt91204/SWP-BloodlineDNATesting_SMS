using System;
using System.ComponentModel.DataAnnotations;

namespace Services.UserDTO
{
    public class ValidDate : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is null)
                return true; 

            if (value is DateOnly dateOfBirth)
            {
                if (dateOfBirth > DateOnly.FromDateTime(DateTime.Today))
                    return false;
                return true;
            }
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"Invalid Birthday";
        }
    }
}