import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationEndpointService } from '../../../../endpoints/application-endpoints/application-endpoint.service';
import { ApplicationsStore } from './applications.store';

@Injectable()
export class ApplicationsFacade {
  private readonly api = inject(ApplicationEndpointService);
  private readonly store = inject(ApplicationsStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly items = this.store.items;
  readonly totalCount = this.store.totalCount;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly filters = this.store.filters;
  readonly hasItems = this.store.hasItems;
  readonly isEmpty = this.store.isEmpty;

  load(): void {
    const filters = this.store.filters();
    this.store.setLoading(true);
    this.store.setError(null);

    this.api.getAll(filters.page, filters.pageSize, filters.search, filters.status).subscribe({
      next: result => {
        this.store.setResult(result.items, result.totalCount);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError(this.t('ADMIN.APPLICATIONS.LOAD_ERROR'));
        this.store.setLoading(false);
      }
    });
  }

  search(term: string): void {
    this.store.setFilters({ search: term, page: 1 });
    this.load();
  }

  filterByStatus(status: string): void {
    this.store.setFilters({ status, page: 1 });
    this.load();
  }

  changePage(pageIndex: number): void {
    this.store.setFilters({ page: pageIndex + 1 });
    this.load();
  }

  approve(applicationId: string, bedId: string): void {
    this.api.approve(applicationId, bedId).subscribe({
      next: () => {
        this.snackBar.open(this.t('ADMIN.APPLICATIONS.APPROVE_SUCCESS'), this.t('ADMIN.APPLICATIONS.CLOSE'), { duration: 4000 });
        this.load();
      },
      error: () => this.snackBar.open(this.t('ADMIN.APPLICATIONS.APPROVE_ERROR'), this.t('ADMIN.APPLICATIONS.CLOSE'), { duration: 4000 })
    });
  }

  reject(applicationId: string): void {
    this.api.reject(applicationId).subscribe({
      next: () => {
        this.snackBar.open(this.t('ADMIN.APPLICATIONS.REJECT_SUCCESS'), this.t('ADMIN.APPLICATIONS.CLOSE'), { duration: 4000 });
        this.load();
      },
      error: () => this.snackBar.open(this.t('ADMIN.APPLICATIONS.REJECT_ERROR'), this.t('ADMIN.APPLICATIONS.CLOSE'), { duration: 4000 })
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
