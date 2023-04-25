namespace BoatApi.Dtos
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// DTO used to create a new boat entity.
    /// </summary>
    public class BoatDto
    {

        /// <summary>
        /// The unique identifier for the boat.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// The name of the boat.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// The description of the boat.
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// The type of boat.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// The length of the boat.
        /// </summary>
        public int Length { get; set; }

        /// <summary>
        /// The brand of the boat.
        /// </summary>
        public string Brand { get; set; }

        /// <summary>
        /// The year the boat was built.
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// The type of engine installed in the boat.
        /// </summary>
        public string EngineType { get; set; }

        /// <summary>
        /// The fuel capacity of the boat.
        /// </summary>
        public int FuelCapacity { get; set; }

        /// <summary>
        /// The water capacity of the boat.
        /// </summary>
        public int WaterCapacity { get; set; }
    }
}
