import { computed, Injectable, signal } from '@angular/core';
import { AdminApplicationListItem } from '../../../../endpoints/application-endpoints/application.models';

export interface ApplicationFilters {
  search: string;
  status: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class ApplicationsStore {
  private readonly itemsState = signal<AdminApplicationListItem[]>([]);
  private readonly totalCountState = signal(0);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly filtersState = signal<ApplicationFilters>({
    search: '',
    status: '',
    page: 1,
    pageSize: 10
  });

  readonly items = this.itemsState.asReadonly();
  readonly totalCount = this.totalCountState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly filters = this.filtersState.asReadonly();
  readonly hasItems = computed(() => this.itemsState().length > 0);
  readonly isEmpty = computed(() => !this.loadingState() && this.itemsState().length === 0);

  setLoading(value: boolean): void {
    this.loadingState.set(value);
  }

  setError(value: string | null): void {
    this.errorState.set(value);
  }

  setFilters(filters: Partial<ApplicationFilters>): void {
    this.filtersState.update(current => ({ ...current, ...filters }));
  }

  setResult(items: AdminApplicationListItem[], totalCount: number): void {
    this.itemsState.set(items);
    this.totalCountState.set(totalCount);
  }
}
