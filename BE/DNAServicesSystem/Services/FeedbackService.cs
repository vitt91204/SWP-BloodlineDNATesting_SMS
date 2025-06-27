using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Models;
using Repositories;
using Services.FeedbackDTO;
namespace Services
{
    public class FeedbackService
    {
        private readonly FeedbackRepository feedbackRepository;
        public FeedbackService()
        {
            feedbackRepository = new FeedbackRepository();
        }
        public async Task<List<Feedback>> GetFeedbackByUserIdAsync(int userId)
        {
            return await feedbackRepository.GetFeedbackByUserIdAsync(userId);
        }
        public async Task<List<Feedback>> GetFeedbackByRequestIdAsync(int requestId)
        {
            return await feedbackRepository.GetFeedbackByRequestIdAsync(requestId);
        }
        public async Task<Feedback?> GetFeedbackByIdAsync(int feedbackId)
        {
            return await feedbackRepository.GetByIdAsync(feedbackId);
        }
        public async Task<Feedback> CreateFeedbackAsync(CreateFeedbackRequest feedbackDto)
        {
            var feedback = new Feedback
            {
                UserId = feedbackDto.UserId,
                RequestId = feedbackDto.RequestId,
                Rating = feedbackDto.Rating,
                Comment = feedbackDto.Comment,
                CreatedAt = DateTime.UtcNow
            };
            await feedbackRepository.CreateAsync(feedback);
            return feedback;
        }
        public async Task UpdateFeedbackAsync(int feedbackId, CreateFeedbackRequest feedbackDto)
        {
            var feedback = await feedbackRepository.GetByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new KeyNotFoundException($"Feedback with ID {feedbackId} not found.");
            }
            feedback.UserId = feedback.UserId;
            feedback.RequestId = feedback.RequestId;
            feedback.Rating = feedbackDto.Rating;
            feedback.Comment = feedbackDto.Comment;
            await feedbackRepository.UpdateAsync(feedback);
        }

        public async Task RespondToFeedbackAsync(int feedbackId, ResponseFeedback responseDto)
        {
            var feedback = await feedbackRepository.GetByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new KeyNotFoundException($"Feedback with ID {feedbackId} not found.");
            }
            feedback.Response = responseDto.Response;
            feedback.RespondedAt = responseDto.ResponseAt ?? DateTime.UtcNow;
            await feedbackRepository.UpdateAsync(feedback);
        }

        public async Task DeleteFeedbackAsync(int feedbackId)
        {
            var feedback = await feedbackRepository.GetByIdAsync(feedbackId);
            if (feedback == null)
            {
                throw new KeyNotFoundException($"Feedback with ID {feedbackId} not found.");
            }
            await feedbackRepository.RemoveAsync(feedback);
        }
    }
}
