namespace UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;

public static class AnalyticsSnapshotProvider
{
    public static async Task<GetAnalyticsSnapshotQueryDto> GetAsync(
        IAppDbContext context,
        TimeProvider timeProvider,
        CancellationToken ct)
    {
        var now = timeProvider.GetUtcNow().UtcDateTime;

        return new GetAnalyticsSnapshotQueryDto
        {
            TotalUsers = await context.Users.AsNoTracking().CountAsync(ct),
            TotalMessages = await context.Messages.AsNoTracking().CountAsync(ct),
            TotalRooms = await context.Rooms.AsNoTracking().CountAsync(ct),
            TotalHalls = await context.Halls.AsNoTracking().CountAsync(ct),
            TotalFaults = await context.Faults.AsNoTracking().CountAsync(ct),
            TotalEquipment = await context.Equipment.AsNoTracking().CountAsync(ct),
            TotalEquipmentItems = await context.EquipmentItems.AsNoTracking().CountAsync(ct),
            TotalApplications = await context.AccommodationApplications.AsNoTracking().CountAsync(ct),
            TotalInvoices = await context.Invoices.AsNoTracking().CountAsync(ct),
            TotalPayments = await context.Payments.AsNoTracking().CountAsync(ct),
            TotalNotifications = await context.Notifications.AsNoTracking().CountAsync(ct),
            ActiveUsers = await context.RefreshTokens
                .AsNoTracking()
                .Where(x => !x.IsRevoked && x.ExpiresAtUtc > now)
                .Select(x => x.UserId)
                .Distinct()
                .CountAsync(ct)
        };
    }
}