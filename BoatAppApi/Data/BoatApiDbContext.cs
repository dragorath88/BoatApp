namespace BoatApi.Data
{
    using BoatApi.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    /// <summary>
    /// Represents the database context for the BoatApi application.
    /// </summary>
    public class BoatApiDbContext : IdentityDbContext<BoatApiUser>
    {
        /// <summary>
        /// Gets or sets the boats DbSet.
        /// </summary>
        public DbSet<Boat> Boats { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BoatApiDbContext"/> class with the specified options.
        /// </summary>
        /// <param name="options">The options to be used for this context.</param>
        public BoatApiDbContext(DbContextOptions<BoatApiDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Configures the model for this context.
        /// </summary>
        /// <param name="modelBuilder">The builder being used to construct the model for this context.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Boat entity.
            modelBuilder.Entity<Boat>(entity =>
            {
                // Set the primary key for the entity.
                entity.HasKey(e => e.Id);

                // Generate a new value for the Id property on insert.
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                // The Name property is required.
                entity.Property(e => e.Name)
                    .IsRequired();

                // The Description property is required.
                entity.Property(e => e.Description)
                    .IsRequired();

                // The Type property has a maximum length of 100.
                entity.Property(e => e.Type)
                    .HasMaxLength(100);

                // The Length property.
                entity.Property(e => e.Length);

                // The Brand property has a maximum length of 100.
                entity.Property(e => e.Brand)
                    .HasMaxLength(100);

                // The Year property.
                entity.Property(e => e.Year);

                // The EngineType property has a maximum length of 100.
                entity.Property(e => e.EngineType)
                    .HasMaxLength(100);

                // The FuelCapacity property.
                entity.Property(e => e.FuelCapacity);

                // The WaterCapacity property.
                entity.Property(e => e.WaterCapacity);
            });
        }
    }
}