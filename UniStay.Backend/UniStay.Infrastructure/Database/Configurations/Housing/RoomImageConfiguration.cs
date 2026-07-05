namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class RoomImageConfiguration : IEntityTypeConfiguration<RoomImageEntity>
{
    public void Configure(EntityTypeBuilder<RoomImageEntity> builder)
    {
        builder.ToTable("RoomImages");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ImageUrl)
            .HasMaxLength(500)
            .IsRequired();
    }
}
