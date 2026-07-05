using UniStay.Domain.Entities.Applications;

namespace UniStay.Infrastructure.Database.Configurations.Applications;

public sealed class AccommodationApplicationConfiguration : IEntityTypeConfiguration<AccommodationApplicationEntity>
{
    public void Configure(EntityTypeBuilder<AccommodationApplicationEntity> builder)
    {
        builder.ToTable("AccommodationApplications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AppliedAtUtc)
            .IsRequired();

        builder.Property(x => x.DecisionAtUtc)
            .IsRequired(false);

        builder.Property(x => x.PreferredRoomType)
            .IsRequired()
            .HasMaxLength(AccommodationApplicationEntity.Constraints.PreferredRoomTypeMaxLength);

        builder.Property(x => x.PreferredRoomId)
            .IsRequired(false);

        builder.Property(x => x.YearOfStudy)
            .IsRequired();

        builder.Property(x => x.GpaScore)
            .HasPrecision(4, 2)
            .IsRequired(false);

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(AccommodationApplicationEntity.Constraints.PhoneNumberMaxLength)
            .IsRequired(false);

        builder.Property(x => x.SpecialRequirements)
            .HasMaxLength(AccommodationApplicationEntity.Constraints.SpecialRequirementsMaxLength)
            .IsRequired(false);

        builder.Property(x => x.DocumentNames)
            .HasMaxLength(AccommodationApplicationEntity.Constraints.DocumentNamesMaxLength)
            .IsRequired(false);

        builder.Property(x => x.Notes)
            .HasMaxLength(AccommodationApplicationEntity.Constraints.NotesMaxLength)
            .IsRequired(false);

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(AccommodationApplicationEntity.Constraints.StatusMaxLength)
            .IsRequired();

        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.PreferredRoom)
            .WithMany()
            .HasForeignKey(x => x.PreferredRoomId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        builder.HasOne(x => x.AssignedRoom)
            .WithMany()
            .HasForeignKey(x => x.AssignedRoomId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        builder.HasOne(x => x.DecisionByUser)
            .WithMany()
            .HasForeignKey(x => x.DecisionByUserId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        builder.HasIndex(x => x.StudentId);
        builder.HasIndex(x => x.Status);
    }
}
