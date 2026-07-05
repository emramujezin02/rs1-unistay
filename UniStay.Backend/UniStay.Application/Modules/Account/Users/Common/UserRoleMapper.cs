namespace UniStay.Application.Modules.Account.Users.Common;

public static class UserRoleMapper
{
    public const int AdminRoleId = 1;
    public const int StudentRoleId = 2;
    public const int EmployeeRoleId = 3;
    public const int ManagerRoleId = 4;

    public static string GetRoleName(UniStayUserEntity user)
    {
        if (user.IsAdmin)
            return "Admin";

        if (user.IsStudent)
            return "Student";

        if (user.IsManager)
            return "Manager";

        if (user.IsEmployee)
            return "Employee";

        return "User";
    }

    public static int? GetRoleId(UniStayUserEntity user)
    {
        if (user.IsAdmin)
            return AdminRoleId;

        if (user.IsStudent)
            return StudentRoleId;

        if (user.IsEmployee)
            return EmployeeRoleId;

        if (user.IsManager)
            return ManagerRoleId;

        return null;
    }

    public static bool IsSupportedRole(int roleId)
    {
        return roleId is AdminRoleId or StudentRoleId or EmployeeRoleId or ManagerRoleId;
    }

    public static void ApplyRole(UniStayUserEntity user, int? roleId)
    {
        user.IsAdmin = false;
        user.IsStudent = false;
        user.IsEmployee = false;
        user.IsManager = false;

        switch (roleId ?? StudentRoleId)
        {
            case AdminRoleId:
                user.IsAdmin = true;
                break;
            case StudentRoleId:
                user.IsStudent = true;
                break;
            case EmployeeRoleId:
                user.IsEmployee = true;
                break;
            case ManagerRoleId:
                user.IsManager = true;
                break;
        }
    }
}
