namespace UniStay.Infrastructure.Database.Configurations.Housing;

public class EquipmentConfiguration : IEntityTypeConfiguration<EquipmentEntity>
{
    public void Configure(EntityTypeBuilder<EquipmentEntity> builder)
    {
        builder.ToTable("Equipment");

        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(EquipmentEntity.Constraints.NameMaxLength);

        builder
            .Property(x => x.Description)
            .HasMaxLength(EquipmentEntity.Constraints.DescriptionMaxLength);

        builder
            .Property(x => x.RentalPrice)
            .HasMaxLength(EquipmentEntity.Constraints.RentalPriceMaxLength);

        builder
            .Property(x => x.EquipmentType)
            .HasMaxLength(EquipmentEntity.Constraints.EquipmentTypeMaxLength);

        builder
            .HasMany(x => x.Items)
            .WithOne(x => x.Equipment)
            .HasForeignKey(x => x.EquipmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
