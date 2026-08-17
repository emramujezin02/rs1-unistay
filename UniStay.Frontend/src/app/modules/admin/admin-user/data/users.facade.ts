import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { UserDeleteEndpointService } from '../../../../endpoints/user-endpoints/user-delete-endpoint.service';
import { UserGetAllEndpointService } from '../../../../endpoints/user-endpoints/user-get-all-endpoint.service';
import { AdminUserFilters } from './users.models';
import { UsersStore } from './users.store';

@Injectable()
export class UsersFacade {
  private readonly store = inject(UsersStore);
  private readonly usersApi = inject(UserGetAllEndpointService);
  private readonly deleteApi = inject(UserDeleteEndpointService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly users = this.store.users;
  readonly totalCount = this.store.totalCount;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly filters = this.store.filters;
  readonly hasUsers = this.store.hasUsers;
  readonly isEmpty = this.store.isEmpty;

  loadUsers(): void {
    const { page, pageSize, search } = this.store.filters();
    this.store.setLoading(true);
    this.store.setError(null);

    this.usersApi.getAll({
      q: search,
      pageNumber: page,
      pageSize
    }).subscribe({
      next: result => {
        this.store.setResult(result);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError(this.t('ADMIN.USERS.LOAD_ERROR'));
        this.store.setLoading(false);
      }
    });
  }

  applyFilters(filters: Partial<AdminUserFilters>): void {
    this.store.setFilters({ ...filters, page: 1 });
    this.loadUsers();
  }

  changePage(pageIndex: number): void {
    this.store.setFilters({ page: pageIndex + 1 });
    this.loadUsers();
  }

  deleteUser(id: number): void {
    this.deleteApi.deleteUser(id).subscribe({
      next: () => {
        this.store.removeUser(id);
        this.snackBar.open(this.t('ADMIN.USERS.DELETE_SUCCESS'), this.t('ADMIN.USERS.CLOSE'), { duration: 3000 });
      },
      error: () => {
        this.snackBar.open(this.t('ADMIN.USERS.DELETE_ERROR'), this.t('ADMIN.USERS.CLOSE'), { duration: 3000 });
      }
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
