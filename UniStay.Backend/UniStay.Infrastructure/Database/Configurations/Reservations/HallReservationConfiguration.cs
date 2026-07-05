using UniStay.Domain.Entities.Reservations;

namespace UniStay.Infrastructure.Database.Configurations.Reservations;

public sealed class HallReservationConfiguration : IEntityTypeConfiguration<HallReservationEntity>
{
    public void Configure(EntityTypeBuilder<HallReservationEntity> builder)
    {
        builder.ToTable("HallReservations");

        builder.Property(x => x.FromDate).IsRequired();
        builder.Property(x => x.ToDate).IsRequired();

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(x => new { x.HallId, x.FromDate, x.ToDate });

        builder.HasOne(x => x.Hall)
            .WithMany(x => x.HallReservations)
            .HasForeignKey(x => x.HallId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Student)
            .WithMany(x => x.HallReservations)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
