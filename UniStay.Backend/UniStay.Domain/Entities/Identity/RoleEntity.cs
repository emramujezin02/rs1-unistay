using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class RoleEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public static class Constraints
    {
        public const int NameMaxLength = 100;
    }
}
