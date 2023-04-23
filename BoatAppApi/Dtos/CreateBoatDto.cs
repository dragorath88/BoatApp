using System.ComponentModel.DataAnnotations;

namespace BoatApi.Dtos
{
    /// <summary>
    /// DTO used to create a new boat entity.
    /// </summary>
    public class CreateBoatDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        public string Type { get; set; } = string.Empty;
        public int Length { get; set; } = 0;
        public string Brand { get; set; } = string.Empty;
        public int Year { get; set; } = 0;
        public string EngineType { get; set; } = string.Empty;
        public int FuelCapacity { get; set; } = 0;
        public int WaterCapacity { get; set; } = 0;
    }
}
