namespace UniStay.Infrastructure.Database.Configurations.Housing;

public class EquipmentItemConfiguration : IEntityTypeConfiguration<EquipmentItemEntity>
{
    public void Configure(EntityTypeBuilder<EquipmentItemEntity> builder)
    {
        builder.ToTable("EquipmentItems");

        builder
            .Property(x => x.SerialNumber)
            .HasColumnName("RecordSerialNumber")
            .HasMaxLength(EquipmentItemEntity.Constraints.SerialNumberMaxLength);

        builder
            .Property(x => x.Location)
            .HasMaxLength(EquipmentItemEntity.Constraints.LocationMaxLength);

        builder
            .Property(x => x.IsAvailable)
            .IsRequired();

        builder
            .HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
