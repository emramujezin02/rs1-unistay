using UniStay.Domain.Entities.Housing;

namespace UniStay.Infrastructure.Database.Configurations.Housing;

public class HallConfiguration : IEntityTypeConfiguration<HallEntity>
{
    public void Configure(EntityTypeBuilder<HallEntity> builder)
    {
        builder.ToTable("Halls");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(HallEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.Capacity)
            .IsRequired();

        builder
            .Property(x => x.Description)
            .HasMaxLength(HallEntity.Constraints.DescriptionMaxLength);

        builder
            .Property(x => x.AvailableFrom)
            .IsRequired();

        builder
            .Property(x => x.AvailableTo)
            .IsRequired();

        builder
            .Property(x => x.IsAvailable)
            .IsRequired();
    }
}
