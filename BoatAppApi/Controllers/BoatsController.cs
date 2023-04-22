using BoatApi.Dtos;
using BoatApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BoatApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoatsController : ControllerBase
    {
        private readonly IBoatService _boatService;
        private readonly ILogger<BoatsController> _logger;

        public BoatsController(IBoatService boatService, ILogger<BoatsController> logger)
        {
            _boatService = boatService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all boats from the database.
        /// </summary>
        /// <returns>A list of boats.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoatDto>>> GetBoats()
        {
            try
            {
                var boats = await _boatService.GetAllAsync();
                return Ok(boats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving boats.");
                return StatusCode(500, "An error occurred while retrieving boats.");
            }
        }

        // POST api/boats
        [HttpPost]
        public async Task<ActionResult<BoatDto>> CreateBoat([FromBody] CreateBoatDto createBoatDto)
        {
            try
            {
                var boat = await _boatService.CreateAsync(createBoatDto);
                return CreatedAtAction(nameof(GetBoatById), new { id = boat.Id }, boat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a boat.");
                return StatusCode(500, "An error occurred while creating a boat.");
            }
        }

        // GET api/boats/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BoatDto>> GetBoatById(Guid id)
        {
            try
            {
                var boat = await _boatService.GetByIdAsync(id);
                if (boat == null)
                {
                    return NotFound();
                }
                return Ok(boat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving a boat.");
                return StatusCode(500, "An error occurred while retrieving a boat.");
            }
        }

        // PUT api/boats/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<BoatDto>> UpdateBoat(Guid id, [FromBody] UpdateBoatDto updateBoatDto)
        {
            try
            {
                var boat = await _boatService.UpdateAsync(id, updateBoatDto);
                if (boat == null)
                {
                    return NotFound();
                }
                return Ok(boat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating a boat.");
                return StatusCode(500, "An error occurred while updating a boat.");
            }
        }

        // DELETE api/boats/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoat(Guid id)
        {
            try
            {
                await _boatService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting a boat.");
                return StatusCode(500, "An error occurred while deleting a boat.");
            }
        }
    }
}
