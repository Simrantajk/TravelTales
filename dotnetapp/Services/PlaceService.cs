using System;
using System.Linq;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
 
namespace dotnetapp.Services
{
 public class PlaceService
{
private readonly ApplicationDbContext _context;
private readonly ILogger<PlaceService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor; // <--- NEW / MODIFIED LINE: HttpContext accessor
 
public PlaceService(ApplicationDbContext context, ILogger<PlaceService> logger, IHttpContextAccessor httpContextAccessor) // <--- NEW / MODIFIED LINE: Injection
{
_context = context;
_logger = logger;
            _httpContextAccessor = httpContextAccessor; // <--- NEW / MODIFIED LINE
}
 
        // <--- NEW / MODIFIED LINE: Helper to extract user details
        private (string UserName, string UserRole) GetCurrentUserDetails()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            // The ClaimTypes.Name usually holds the user's email/username as set during JWT generation
            var userName = user?.FindFirst(ClaimTypes.Name)?.Value ?? "Unauthenticated";
            // Get the user's primary role (assuming a user has one main role for logging)
            var userRole = user?.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown Role";
            return (userName, userRole);
        }
        // <--- END NEW HELPER
 
public async Task<IEnumerable<Place>> GetAllPlaces()
{
var (user, role) = GetCurrentUserDetails(); // <--- NEW / MODIFIED LINE
_logger.LogInformation("User {UserName} ({Role}) attempting to retrieve all places.", user, role); // <--- NEW / MODIFIED LINE
return await _context.Places.ToListAsync();
}
 
public async Task<Place> GetPlaceById(int placeId)
{
var (user, role) = GetCurrentUserDetails(); // <--- NEW / MODIFIED LINE
_logger.LogDebug("User {UserName} ({Role}) fetching place with ID: {PlaceId}", user, role, placeId); // <--- NEW / MODIFIED LINE
return await _context.Places.FirstOrDefaultAsync(p => p.PlaceId == placeId);
}
 
public async Task<bool> AddPlace(Place place)
{
var (user, role) = GetCurrentUserDetails(); // <--- NEW / MODIFIED LINE
_logger.LogInformation("User {UserName} ({Role}) attempting to add new place: {PlaceName}", user, role, place.Name); // <--- NEW / MODIFIED LINE
 
var existingPlace = await _context.Places.FirstOrDefaultAsync(p => p.Name == place.Name);
if (existingPlace != null)
{
// Warning log for business logic failure
_logger.LogWarning("AddPlace failed by {UserName} ({Role}): A place with the name '{PlaceName}' already exists.", user, role, place.Name); // <--- NEW / MODIFIED LINE
return false;
}
 
try
{
_context.Places.Add(place);
await _context.SaveChangesAsync();
_logger.LogInformation("Place ID: {PlaceId} added successfully by {UserName} ({Role}). Name: {PlaceName}", place.PlaceId, user, role, place.Name); // <--- NEW / MODIFIED LINE
return true;
}
catch (Exception ex)
{
// Error log for exceptions during save
_logger.LogError(ex, "Failed to save new place '{PlaceName}' (Attempted by {UserName} ({Role})).", place.Name, user, role); // <--- NEW / MODIFIED LINE
return false;
}
}
 
public async Task<bool> UpdatePlace(int placeId, Place place)
{
var (user, role) = GetCurrentUserDetails(); // <--- NEW / MODIFIED LINE
_logger.LogInformation("User {UserName} ({Role}) attempting to update place ID: {PlaceId}", user, role, placeId); // <--- NEW / MODIFIED LINE
 
var existingPlace = await _context.Places.FindAsync(placeId);
if (existingPlace == null)
{
_logger.LogWarning("UpdatePlace failed by {UserName} ({Role}): Place with ID {PlaceId} not found.", user, role, placeId); // <--- NEW / MODIFIED LINE
return false;
}
 
try
{
// Update properties
existingPlace.Name = place.Name;
existingPlace.Category = place.Category;
existingPlace.BestTimeToVisit = place.BestTimeToVisit;
existingPlace.PlaceImage = place.PlaceImage;
existingPlace.Location = place.Location;
 
await _context.SaveChangesAsync();
_logger.LogInformation("Place ID {PlaceId} updated successfully by {UserName} ({Role}).", placeId, user, role); // <--- NEW / MODIFIED LINE
return true;
}
catch (Exception ex)
{
_logger.LogError(ex, "Failed to update place ID {PlaceId} (Attempted by {UserName} ({Role})).", placeId, user, role); // <--- NEW / MODIFIED LINE
return false;
}
}
 
public async Task<bool> DeletePlace(int placeId)
{
var (user, role) = GetCurrentUserDetails(); // <--- NEW / MODIFIED LINE
_logger.LogInformation("User {UserName} ({Role}) attempting to delete place ID: {PlaceId}", user, role, placeId); // <--- NEW / MODIFIED LINE
 
var place = await _context.Places.FindAsync(placeId);
if (place == null)
{
_logger.LogWarning("DeletePlace failed by {UserName} ({Role}): Place with ID {PlaceId} not found for deletion.", user, role, placeId); // <--- NEW / MODIFIED LINE
return false;
}
 
try
{
_context.Places.Remove(place);
await _context.SaveChangesAsync();
_logger.LogInformation("Place ID {PlaceId} deleted successfully by {UserName} ({Role}).", placeId, user, role); // <--- NEW / MODIFIED LINE
return true;
}
catch (Exception ex)
{
_logger.LogError(ex, "Failed to delete place ID {PlaceId} (Attempted by {UserName} ({Role})).", placeId, user, role); // <--- NEW / MODIFIED LINE
return false;
}
}
}
}
 