import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HallReservationsEndpointService } from '../../../../endpoints/hall-reservation-endpoints/hall-reservations-endpoint.service';
import { HallReservationsStore } from './hall-reservations.store';

@Injectable()
export class HallReservationsFacade {
  private readonly api = inject(HallReservationsEndpointService);
  private readonly store = inject(HallReservationsStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly reservations = this.store.reservations;
  readonly totalCount = this.store.totalCount;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly filters = this.store.filters;
  readonly hasReservations = this.store.hasReservations;
  readonly isEmpty = this.store.isEmpty;

  load(): void {
    const filters = this.store.filters();
    this.store.setLoading(true);
    this.store.setError(null);

    this.api.getAll(filters.page, filters.pageSize, filters.search).subscribe({
      next: result => {
        this.store.setResult(result.items, result.totalCount);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('ADMIN.HALL_RESERVATIONS.LOAD_ERROR');
        this.store.setLoading(false);
      }
    });
  }

  search(term: string): void {
    this.store.setFilters({ search: term, page: 1 });
    this.load();
  }

  changePage(pageIndex: number): void {
    this.store.setFilters({ page: pageIndex + 1 });
    this.load();
  }

  approve(id: string): void {
    this.api.updateStatus(id, 'Active').subscribe({
      next: updated => {
        this.store.updateReservation(updated);
        this.snackBar.open(this.t('APPROVE_SUCCESS'), this.t('CLOSE'), { duration: 3000 });
      },
      error: () => this.snackBar.open(this.t('APPROVE_ERROR'), this.t('CLOSE'), { duration: 3000 })
    });
  }

  reject(id: string): void {
    this.api.updateStatus(id, 'Rejected').subscribe({
      next: updated => {
        this.store.updateReservation(updated);
        this.snackBar.open(this.t('REJECT_SUCCESS'), this.t('CLOSE'), { duration: 3000 });
      },
      error: () => this.snackBar.open(this.t('REJECT_ERROR'), this.t('CLOSE'), { duration: 3000 })
    });
  }

  private t(key: string): string {
    return this.translate.instant(`ADMIN.HALL_RESERVATIONS.${key}`);
  }
}
