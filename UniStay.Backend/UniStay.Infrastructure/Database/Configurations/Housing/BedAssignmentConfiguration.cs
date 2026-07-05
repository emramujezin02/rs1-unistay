namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class BedAssignmentConfiguration : IEntityTypeConfiguration<BedAssignmentEntity>
{
    public void Configure(EntityTypeBuilder<BedAssignmentEntity> builder)
    {
        builder.ToTable("BedAssignments");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.BedId, x.StudentId, x.FromDate });
    }
}
