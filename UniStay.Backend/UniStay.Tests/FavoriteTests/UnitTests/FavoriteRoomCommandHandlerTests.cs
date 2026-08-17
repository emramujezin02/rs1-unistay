using UniStay.Application.Common.Exceptions;
using UniStay.Application.Modules.Housing.Favorites.Commands.Add;
using UniStay.Application.Modules.Housing.Favorites.Commands.Remove;
using UniStay.Application.Modules.Housing.Favorites.Queries.ListMy;
using UniStay.Domain.Entities.Housing;
using UniStay.Tests.Services;

namespace UniStay.Tests.FavoriteTests.UnitTests;

public class FavoriteRoomCommandHandlerTests
{
    [Fact]
    public async Task Should_Readd_Previously_Removed_Favorite()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var currentUser = new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId);
        var addHandler = new AddFavoriteRoomCommandHandler(db, currentUser);
        var removeHandler = new RemoveFavoriteRoomCommandHandler(db, currentUser);
        var listHandler = new ListMyFavoriteRoomsQueryHandler(db, currentUser);
        var command = new AddFavoriteRoomCommand { RoomId = ApplicationTestDatabaseContext.RoomId };

        await addHandler.Handle(command, CancellationToken.None);
        Assert.Contains(
            await listHandler.Handle(new ListMyFavoriteRoomsQuery(), CancellationToken.None),
            x => x.RoomId == ApplicationTestDatabaseContext.RoomId);

        await removeHandler.Handle(
            new RemoveFavoriteRoomCommand { RoomId = ApplicationTestDatabaseContext.RoomId },
            CancellationToken.None);
        Assert.DoesNotContain(
            await listHandler.Handle(new ListMyFavoriteRoomsQuery(), CancellationToken.None),
            x => x.RoomId == ApplicationTestDatabaseContext.RoomId);

        await addHandler.Handle(command, CancellationToken.None);

        Assert.Contains(
            await listHandler.Handle(new ListMyFavoriteRoomsQuery(), CancellationToken.None),
            x => x.RoomId == ApplicationTestDatabaseContext.RoomId);

        var favorite = await db.FavoriteRooms
            .IgnoreQueryFilters()
            .SingleAsync(x => x.UserId == ApplicationTestDatabaseContext.StudentId
                && x.RoomId == ApplicationTestDatabaseContext.RoomId);
        Assert.False(favorite.IsDeleted);
    }

    [Fact]
    public async Task Should_Still_Block_Active_Duplicate_Favorite()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new AddFavoriteRoomCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));
        var command = new AddFavoriteRoomCommand { RoomId = ApplicationTestDatabaseContext.RoomId };

        await handler.Handle(command, CancellationToken.None);

        await Assert.ThrowsAsync<UniStayConflictException>(
            () => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Should_Not_Change_Other_Users_Favorite_When_Readding()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        const int otherUserId = 202;
        db.FavoriteRooms.Add(new FavoriteRoomEntity
        {
            UserId = otherUserId,
            RoomId = ApplicationTestDatabaseContext.RoomId
        });
        await db.SaveChangesAsync(CancellationToken.None);

        var currentUser = new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId);
        var addHandler = new AddFavoriteRoomCommandHandler(db, currentUser);
        var removeHandler = new RemoveFavoriteRoomCommandHandler(db, currentUser);
        var command = new AddFavoriteRoomCommand { RoomId = ApplicationTestDatabaseContext.RoomId };

        await addHandler.Handle(command, CancellationToken.None);
        await removeHandler.Handle(
            new RemoveFavoriteRoomCommand { RoomId = ApplicationTestDatabaseContext.RoomId },
            CancellationToken.None);
        await addHandler.Handle(command, CancellationToken.None);

        var otherFavorite = await db.FavoriteRooms
            .IgnoreQueryFilters()
            .SingleAsync(x => x.UserId == otherUserId && x.RoomId == ApplicationTestDatabaseContext.RoomId);
        var currentUserFavorite = await db.FavoriteRooms
            .IgnoreQueryFilters()
            .SingleAsync(x => x.UserId == ApplicationTestDatabaseContext.StudentId
                && x.RoomId == ApplicationTestDatabaseContext.RoomId);

        Assert.False(otherFavorite.IsDeleted);
        Assert.False(currentUserFavorite.IsDeleted);
    }
}
