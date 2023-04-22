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

        public string Type { get; set; }
        public int Length { get; set; }
        public string Brand { get; set; }
        public int Year { get; set; }
        public string EngineType { get; set; }
        public int FuelCapacity { get; set; }
        public int WaterCapacity { get; set; }
    }
}
