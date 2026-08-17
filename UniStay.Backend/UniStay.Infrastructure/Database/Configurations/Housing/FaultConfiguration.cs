namespace UniStay.Infrastructure.Database.Configurations.Housing;

public class FaultConfiguration : IEntityTypeConfiguration<FaultEntity>
{
    public void Configure(EntityTypeBuilder<FaultEntity> builder)
    {
        builder.ToTable("Faults");

        builder
            .Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(FaultEntity.Constraints.TitleMaxLength);

        builder
            .Property(x => x.Description)
            .HasMaxLength(FaultEntity.Constraints.DescriptionMaxLength);

        builder
            .Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(FaultEntity.Constraints.StatusMaxLength);

        builder
            .Property(x => x.Priority)
            .HasMaxLength(FaultEntity.Constraints.PriorityMaxLength);

        builder
            .Property(x => x.ReportedAtUtc)
            .IsRequired();

        builder
            .Property(x => x.IsResolved)
            .IsRequired();

        builder
            .Property(x => x.RoomId)
            .IsRequired();

        builder
            .HasOne(x => x.ReportedByUser)
            .WithMany()
            .HasForeignKey(x => x.ReportedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
