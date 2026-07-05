using FluentValidation.TestHelper;
using UniStay.Application.Modules.Housing.Halls.Commands.Create;

namespace UniStay.Tests.HallTests.UnitTests;

public class HallCreateValidatorTests
{
    private readonly CreateHallCommandValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty()
    {
        var command = new CreateHallCommand
        {
            Name = "",
            Capacity = 10,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Valid()
    {
        var command = new CreateHallCommand
        {
            Name = "Hall",
            Capacity = 10,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }
}
