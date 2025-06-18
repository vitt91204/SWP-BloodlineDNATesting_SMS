using Repositories;
using Repositories.Models;
using Services.ProfileDTO;
using System;
using System.Threading.Tasks;

namespace Services
{
    public class ProfileService
    {
        private readonly ProfileRepository profileRepository;

        public ProfileService()
        {
            profileRepository = new ProfileRepository();
        }

        public async Task<Profile> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            var profile = await profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                throw new KeyNotFoundException($"Profile for user {userId} not found.");
            }

            profile.FullName = request.FullName ?? profile.FullName;
            profile.DateOfBirth = request.DateOfBirth ?? profile.DateOfBirth;
            profile.Gender = request.Gender ?? profile.Gender;
            profile.Address = request.Address ?? profile.Address;

            await profileRepository.UpdateAsync(profile);
            return profile;
        }
    }
}