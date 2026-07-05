namespace UniStay.Application.Modules.Files.Commands.Upload;

public sealed class UploadFileCommandValidator : AbstractValidator<UploadFileCommand>
{
    private static readonly HashSet<string> AllowedExtensions =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"
        };

    public const long MaxFileSizeBytes = 10 * 1024 * 1024;

    public UploadFileCommandValidator()
    {
        RuleFor(x => x.Content)
            .NotNull()
            .WithMessage("No file provided.");

        RuleFor(x => x.Length)
            .GreaterThan(0)
            .WithMessage("No file provided.")
            .LessThanOrEqualTo(MaxFileSizeBytes)
            .WithMessage("File exceeds the 10 MB limit.");

        RuleFor(x => x.FileName)
            .NotEmpty()
            .WithMessage("No file provided.")
            .Must(HaveAllowedExtension)
            .WithMessage(command =>
            {
                var ext = Path.GetExtension(command.FileName);
                return $"File type '{ext}' is not allowed. Use PDF, JPG, PNG, DOC or DOCX.";
            });
    }

    private static bool HaveAllowedExtension(string fileName)
    {
        var ext = Path.GetExtension(fileName);
        return AllowedExtensions.Contains(ext);
    }
}
