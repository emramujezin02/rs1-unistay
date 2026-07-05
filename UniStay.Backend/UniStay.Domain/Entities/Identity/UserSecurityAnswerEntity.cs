using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class UserSecurityAnswerEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
    public int SecurityQuestionId { get; set; }
    public SecurityQuestionEntity SecurityQuestion { get; set; } = null!;
    public string AnswerHash { get; set; } = string.Empty;
}
