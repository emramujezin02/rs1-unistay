import { computed, Injectable, signal } from '@angular/core';
import { AdminRoom, RoomFilters } from './rooms.models';

@Injectable()
export class RoomsStore {
  private readonly roomsState = signal<AdminRoom[]>([]);
  private readonly totalCountState = signal(0);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly filtersState = signal<RoomFilters>({ search: '', page: 1, pageSize: 10 });

  readonly rooms = this.roomsState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly filters = this.filtersState.asReadonly();
  readonly hasRooms = computed(() => this.roomsState().length > 0);
  readonly isEmpty = computed(() => !this.loadingState() && this.roomsState().length === 0);

  setLoading(loading: boolean): void {
    this.loadingState.set(loading);
  }

  setError(error: string | null): void {
    this.errorState.set(error);
  }

  setResult(items: AdminRoom[], totalCount: number): void {
    this.roomsState.set(items);
    this.totalCountState.set(totalCount);
  }

  removeRoom(id: number): void {
    this.roomsState.update(rooms => rooms.filter(room => room.id !== id));
    this.totalCountState.update(total => Math.max(0, total - 1));
  }

  setFilters(filters: Partial<RoomFilters>): void {
    this.filtersState.update(current => ({ ...current, ...filters }));
  }
}
