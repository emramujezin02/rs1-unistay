import { computed, Injectable, signal } from '@angular/core';
import { HallReservation, ReservationFilters } from './hall-reservations.models';

@Injectable()
export class HallReservationsStore {
  private readonly reservationsState = signal<HallReservation[]>([]);
  private readonly totalCountState = signal(0);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly filtersState = signal<ReservationFilters>({ search: '', page: 1, pageSize: 10 });

  readonly reservations = this.reservationsState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly filters = this.filtersState.asReadonly();
  readonly hasReservations = computed(() => this.reservationsState().length > 0);
  readonly isEmpty = computed(() => !this.loadingState() && this.reservationsState().length === 0);

  setLoading(value: boolean): void {
    this.loadingState.set(value);
  }

  setError(value: string | null): void {
    this.errorState.set(value);
  }

  setFilters(filters: Partial<ReservationFilters>): void {
    this.filtersState.update(current => ({ ...current, ...filters }));
  }

  setResult(items: HallReservation[], totalCount: number): void {
    this.reservationsState.set(items);
    this.totalCountState.set(totalCount);
  }

  updateReservation(updated: HallReservation): void {
    this.reservationsState.update(items => items.map(item => item.id === updated.id ? updated : item));
  }
}
