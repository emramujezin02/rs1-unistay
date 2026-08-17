using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Housing;

public class EquipmentEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? RentalPrice { get; set; }
    public string? EquipmentType { get; set; }
    public ICollection<EquipmentItemEntity> Items { get; private set; } = new List<EquipmentItemEntity>();

    public static class Constraints
    {
        public const int NameMinLength = 2;
        public const int NameMaxLength = 150;
        public const int DescriptionMaxLength = 1000;
        public const int RentalPriceMaxLength = 100;
        public const int EquipmentTypeMaxLength = 100;
    }
}
