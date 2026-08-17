import { computed, Injectable, signal } from '@angular/core';
import { AdminUser, AdminUserFilters } from './users.models';
import { UserGetAllResponse } from '../../../../endpoints/user-endpoints/user.models';

@Injectable()
export class UsersStore {
  private readonly _users = signal<AdminUser[]>([]);
  private readonly _totalCount = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filters = signal<AdminUserFilters>({ search: '', page: 1, pageSize: 10 });

  readonly users = this._users.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly hasUsers = computed(() => this._users().length > 0);
  readonly isEmpty = computed(() => !this._loading() && this._users().length === 0);

  setLoading(value: boolean): void {
    this._loading.set(value);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setResult(result: UserGetAllResponse): void {
    this._users.set(result.items);
    this._totalCount.set(result.totalCount ?? result.totalItems ?? result.items.length);
  }

  removeUser(id: number): void {
    this._users.update(users => users.filter(user => user.id !== id && user.userID !== id));
    this._totalCount.update(total => Math.max(0, total - 1));
  }

  setFilters(filters: Partial<AdminUserFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }
}
