namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class FavoriteRoomConfiguration : IEntityTypeConfiguration<FavoriteRoomEntity>
{
    public void Configure(EntityTypeBuilder<FavoriteRoomEntity> builder)
    {
        builder.ToTable("FavoriteRooms");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.UserId, x.RoomId })
            .IsUnique();

        builder.HasOne(x => x.Room)
            .WithMany(x => x.Favorites)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
