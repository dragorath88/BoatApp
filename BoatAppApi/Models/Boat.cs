namespace BoatApi.Models
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Represents a boat in the application.
    /// </summary>
    public class Boat
    {
        /// <summary>
        /// Gets or sets the unique identifier for the boat.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the boat.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the description of the boat.
        /// </summary>
        [Required]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the type of the boat.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the length of the boat in meters.
        /// </summary>
        public int Length { get; set; }

        /// <summary>
        /// Gets or sets the brand of the boat.
        /// </summary>
        public string Brand { get; set; }

        /// <summary>
        /// Gets or sets the year the boat was built.
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// Gets or sets the type of engine installed in the boat.
        /// </summary>
        public string EngineType { get; set; }

        /// <summary>
        /// Gets or sets the amount of fuel the boat can hold, measured in liters.
        /// </summary>
        public int FuelCapacity { get; set; }

        /// <summary>
        /// Gets or sets the amount of fresh water the boat can hold, measured in liters.
        /// </summary>
        public int WaterCapacity { get; set; }
    }
}