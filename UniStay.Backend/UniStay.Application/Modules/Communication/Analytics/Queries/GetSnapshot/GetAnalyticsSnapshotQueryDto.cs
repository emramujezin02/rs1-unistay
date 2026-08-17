namespace UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;

public sealed class GetAnalyticsSnapshotQueryDto
{
    public int TotalUsers { get; set; }
    public int TotalMessages { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalRooms { get; set; }
    public int TotalHalls { get; set; }
    public int TotalFaults { get; set; }
    public int TotalEquipment { get; set; }
    public int TotalEquipmentItems { get; set; }
    public int TotalApplications { get; set; }
    public int TotalInvoices { get; set; }
    public int TotalPayments { get; set; }
    public int TotalNotifications { get; set; }
}
