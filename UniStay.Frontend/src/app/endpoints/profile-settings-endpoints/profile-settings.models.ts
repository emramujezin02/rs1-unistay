export type ProfileTheme = 'light' | 'dark';

export interface ProfileSettingsDto {
  id: number;
  userId: number;
  userID?: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  dateOfBirth: string | null;
  profileImage: string;
  theme: ProfileTheme;
  roleId?: number | null;
  roleName: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProfileSettingsUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string | null;
  username?: string;
  profileImage?: string | null;
  theme?: ProfileTheme;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface SetThemeResponse {
  userId: number;
  theme: ProfileTheme;
}

export interface ProfileSettingsApiDto {
  id?: number;
  userId?: number;
  userID?: number;
  UserId?: number;
  UserID?: number;
  email?: string;
  Email?: string;
  firstName?: string;
  FirstName?: string;
  lastName?: string;
  LastName?: string;
  username?: string;
  Username?: string;
  phone?: string;
  Phone?: string;
  dateOfBirth?: string | null;
  DateOfBirth?: string | null;
  profileImage?: string;
  ProfileImage?: string;
  theme?: string | null;
  Theme?: string | null;
  roleId?: number | null;
  RoleId?: number | null;
  roleName?: string;
  RoleName?: string;
  isEnabled?: boolean;
  IsEnabled?: boolean;
  createdAt?: string;
  CreatedAt?: string;
  updatedAt?: string | null;
  UpdatedAt?: string | null;
}
