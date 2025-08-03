using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.FeedbackDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService feedbackService;
        
        public FeedbackController(FeedbackService feedbackService)
        {
            this.feedbackService = feedbackService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFeedbackByUserId(int userId)
        {
            var feedbacks = await feedbackService.GetFeedbackByUserIdAsync(userId);
            return Ok(feedbacks);
        }

        [HttpGet("request/{requestId}")]
        public async Task<IActionResult> GetFeedbackByRequestId(int requestId)
        {
            var feedbacks = await feedbackService.GetFeedbackByRequestIdAsync(requestId);
            return Ok(feedbacks);
        }

        [HttpGet("{feedbackId}")]
        public async Task<IActionResult> GetFeedbackById(int feedbackId)
        {
            var feedback = await feedbackService.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                return NotFound($"Feedback with ID {feedbackId} not found.");
            }
            return Ok(feedback);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackRequest feedbackDto)
        {
            if (feedbackDto == null)
            {
                return BadRequest("Feedback data is required.");
            }
            var feedback = await feedbackService.CreateFeedbackAsync(feedbackDto);
            return CreatedAtAction(nameof(GetFeedbackById), new { feedbackId = feedback.FeedbackId }, feedback);
        }
        [HttpPut("{feedbackId}")]
        public async Task<IActionResult> UpdateFeedback(int feedbackId, [FromBody] CreateFeedbackRequest feedbackDto)
        {
            if (feedbackDto == null)
            {
                return BadRequest("Feedback data is required.");
            }
            try
            {
                await feedbackService.UpdateFeedbackAsync(feedbackId, feedbackDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("{feedbackId}/respond")]
        public async Task<IActionResult> RespondToFeedback(int feedbackId, [FromBody] ResponseFeedback responseDto)
        {
            if (responseDto == null)
            {
                return BadRequest("Response data is required.");
            }
            try
            {
                await feedbackService.RespondToFeedbackAsync(feedbackId, responseDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{feedbackId}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                await feedbackService.DeleteFeedbackAsync(feedbackId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
