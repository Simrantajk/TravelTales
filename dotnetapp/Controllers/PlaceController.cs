using System.Linq;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowFrontend")]
    public class PlaceController : ControllerBase
    {
        private readonly PlaceService _placeService;
        private readonly ILogger<PlaceController> _logger;

        public PlaceController(PlaceService placeService, ILogger<PlaceController> logger) 
        {
            _placeService = placeService;
            _logger = logger; 
        }

        [HttpGet]
        [Authorize(Roles ="Guide, Traveller")]
        public async Task<ActionResult<IEnumerable<Place>>> GetAllPlaces()
        {
            try
            {
                var places = await _placeService.GetAllPlaces();
                return Ok(places);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all places."); 
                return StatusCode(500, "Internal server error while fetching places.");
            }
        }

        [HttpGet("{placeId}")]
        [Authorize(Roles ="Guide, Traveller")]
        public async Task<ActionResult<Place>> GetPlaceById(int placeId)
        {
            try
            {
                var place = await _placeService.GetPlaceById(placeId);
                if (place == null)
                {
                    return NotFound("Cannot find any place");
                }
                return Ok(place);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving place with ID: {PlaceId}", placeId); 
                return StatusCode(500, "Internal server error while fetching place.");
            }
        }

        [HttpPost]
        [Authorize(Roles ="Guide")]
        public async Task<ActionResult> AddPlace([FromBody] Place place)
        {
            try
            {
                var result = await _placeService.AddPlace(place);
                if (!result)
                {
                    // This is likely a business rule violation (e.g., duplicate name) handled in the service
                    return BadRequest("Failed to add place. It might already exist or data is invalid.");
                }
                _logger.LogInformation("API: Place '{PlaceName}' added successfully.", place.Name); 
                return Ok("Place added successfully");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception during AddPlace for place: {PlaceName}", place.Name); 
                return StatusCode(500, $"Failed to add place: {ex.Message}");
            }
        }

        [HttpPut("{placeId}")]
        [Authorize(Roles ="Guide")]
        public async Task<ActionResult> UpdatePlace(int placeId, [FromBody] Place place)
        {
            try
            {
                var result = await _placeService.UpdatePlace(placeId, place);
                if (!result)
                {
                    return NotFound("Cannot find any place to update");
                }
                _logger.LogInformation("API: Place ID {PlaceId} updated successfully.", placeId); 
                return Ok("Place updated successfully");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception during UpdatePlace for ID: {PlaceId}", placeId); 
                return StatusCode(500, $"Failed to update place: {ex.Message}");
            }
        }

        [HttpDelete("{placeId}")]
        [Authorize(Roles ="Guide")]
        public async Task<ActionResult> DeletePlace(int placeId)
        {
            try
            {
                var result = await _placeService.DeletePlace(placeId);
                if (!result)
                {
                    return NotFound("Cannot find any place to delete");
                }
                _logger.LogInformation("API: Place ID {PlaceId} deleted successfully.", placeId); 
                return Ok("Place deleted successfully");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception during DeletePlace for ID: {PlaceId}", placeId); 
                return StatusCode(500, $"Failed to delete place: {ex.Message}");
            }
        }
    }
}
