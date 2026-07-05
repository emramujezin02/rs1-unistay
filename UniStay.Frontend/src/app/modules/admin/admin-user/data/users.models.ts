import { UserDto } from '../../../../endpoints/user-endpoints/user.models';

export type AdminUser = UserDto;

export interface AdminUserFilters {
  search: string;
  page: number;
  pageSize: number;
}
