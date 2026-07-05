using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class SecurityQuestionEntity : BaseEntity
{
    public string Text { get; set; } = string.Empty;
    public ICollection<UserSecurityAnswerEntity> UserAnswers { get; private set; } = new List<UserSecurityAnswerEntity>();

    public static class Constraints
    {
        public const int TextMaxLength = 300;
    }
}
