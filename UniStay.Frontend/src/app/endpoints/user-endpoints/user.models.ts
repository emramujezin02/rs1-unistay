export interface PageResult<T> {
  items: T[];
  pageSize: number;
  currentPage: number;
  includedTotal: boolean;
  totalItems: number;
  totalPages: number;
}

export interface UserDto {
  id: number;
  userID: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  dateOfBirth: string | null;
  profileImage: string;
  theme?: 'light' | 'dark' | string | null;
  roleId?: number | null;
  roleName: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export type UserListItem = UserDto;

export interface UserListFilters {
  q?: string | null;
  roleId?: number | null;
  isEnabled?: boolean | null;
}

export interface UserCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string | null;
  username?: string | null;
  password: string;
  profileImage?: string | null;
  theme?: 'light' | 'dark' | string | null;
  roleId?: number | null;
}

export interface UserCreateResponse {
  id: number;
}

export interface UserUpdateRequest {
  id?: number;
  userID?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string | null;
  password?: string;
  username?: string;
  profileImage?: string | null;
  roleId?: number | null;
  isEnabled?: boolean | null;
}

export interface UserGetAllResponse extends PageResult<UserDto> {
  totalCount: number;
  pageNumber: number;
}
