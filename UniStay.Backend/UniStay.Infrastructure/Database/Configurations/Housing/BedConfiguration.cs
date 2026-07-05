namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class BedConfiguration : IEntityTypeConfiguration<BedEntity>
{
    public void Configure(EntityTypeBuilder<BedEntity> builder)
    {
        builder.ToTable("Beds");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.BedNumber)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(x => new { x.RoomId, x.BedNumber })
            .IsUnique();

        builder.HasMany(x => x.Assignments)
            .WithOne(x => x.Bed)
            .HasForeignKey(x => x.BedId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
