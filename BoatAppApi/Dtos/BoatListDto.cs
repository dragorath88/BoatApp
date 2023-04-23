using System;

namespace BoatApi.Dtos
{
    /// <summary>
    /// DTO used to return a list of boats.
    /// </summary>
    public class BoatListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
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
