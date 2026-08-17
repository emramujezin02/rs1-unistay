namespace UniStay.Infrastructure.Database.Configurations.Communication;

public sealed class MessageConfiguration : IEntityTypeConfiguration<MessageEntity>
{
    public void Configure(EntityTypeBuilder<MessageEntity> builder)
    {
        builder.ToTable("Messages");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Subject)
            .HasMaxLength(200);

        builder.Property(x => x.MessageText)
            .HasMaxLength(4000)
            .IsRequired();

        builder.Property(x => x.SentAtUtc)
            .IsRequired();

        builder.HasOne(x => x.SenderUser)
            .WithMany(x => x.SentMessages)
            .HasForeignKey(x => x.SenderUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ReceiverUser)
            .WithMany(x => x.ReceivedMessages)
            .HasForeignKey(x => x.ReceiverUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.SenderUserId, x.ReceiverUserId, x.SentAtUtc });
        builder.HasIndex(x => new { x.ReceiverUserId, x.IsRead });
    }
}
