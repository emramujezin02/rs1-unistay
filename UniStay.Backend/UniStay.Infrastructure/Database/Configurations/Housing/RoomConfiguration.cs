namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class RoomConfiguration : IEntityTypeConfiguration<RoomEntity>
{
    public void Configure(EntityTypeBuilder<RoomEntity> builder)
    {
        builder.ToTable("Rooms");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => x.RoomNumber)
            .IsUnique();

        builder.Property(x => x.RoomNumber)
            .HasMaxLength(RoomEntity.Constraints.RoomNumberMaxLength)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(RoomEntity.Constraints.DescriptionMaxLength)
            .IsRequired();

        builder.Property(x => x.Building)
            .HasMaxLength(RoomEntity.Constraints.BuildingMaxLength);

        builder.Property(x => x.RoomSide)
            .HasMaxLength(RoomEntity.Constraints.RoomSideMaxLength);

        builder.HasOne(x => x.Hall)
            .WithMany(x => x.Rooms)
            .HasForeignKey(x => x.HallId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(x => x.Beds)
            .WithOne(x => x.Room)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Images)
            .WithOne(x => x.Room)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
