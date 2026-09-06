namespace UniStay.Application.Modules.Files.Commands.Upload;

public sealed class UploadFileCommandValidator : AbstractValidator<UploadFileCommand>
{
    private const int MaxSignatureBytes = 8;

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

        RuleFor(x => x)
            .Must(HaveMatchingFileSignature)
            .WithMessage("File content does not match the declared file type.");
    }

    private static bool HaveAllowedExtension(string fileName)
    {
        var ext = Path.GetExtension(fileName);
        return AllowedExtensions.Contains(ext);
    }

    private static bool HaveMatchingFileSignature(UploadFileCommand command)
    {
        if (command.Content is null || command.Length <= 0)
            return false;

        var ext = Path.GetExtension(command.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return false;

        var buffer = new byte[MaxSignatureBytes];
        var originalPosition = command.Content.CanSeek ? command.Content.Position : (long?)null;

        try
        {
            if (command.Content.CanSeek)
                command.Content.Position = 0;

            var read = command.Content.Read(buffer, 0, buffer.Length);
            return ext switch
            {
                ".pdf" => StartsWith(buffer, read, [0x25, 0x50, 0x44, 0x46, 0x2D]),
                ".jpg" or ".jpeg" => StartsWith(buffer, read, [0xFF, 0xD8, 0xFF]),
                ".png" => StartsWith(buffer, read, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
                ".doc" => StartsWith(buffer, read, [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]),
                ".docx" => StartsWith(buffer, read, [0x50, 0x4B, 0x03, 0x04]),
                _ => false
            };
        }
        finally
        {
            if (originalPosition.HasValue)
                command.Content.Position = originalPosition.Value;
        }
    }

    private static bool StartsWith(byte[] buffer, int bytesRead, byte[] signature)
    {
        if (bytesRead < signature.Length)
            return false;

        for (var i = 0; i < signature.Length; i++)
        {
            if (buffer[i] != signature[i])
                return false;
        }

        return true;
    }
}
