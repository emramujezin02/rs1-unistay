import { computed, Injectable, signal } from '@angular/core';
import { BedAssignment, BedAssignmentFilters } from './bed-assignments.models';

@Injectable()
export class BedAssignmentsStore {
  private readonly itemsState = signal<BedAssignment[]>([]);
  private readonly totalCountState = signal(0);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly filtersState = signal<BedAssignmentFilters>({
    search: '',
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

  setFilters(filters: Partial<BedAssignmentFilters>): void {
    this.filtersState.update(current => ({ ...current, ...filters }));
  }

  setResult(items: BedAssignment[], totalCount: number): void {
    this.itemsState.set(items);
    this.totalCountState.set(totalCount);
  }

  removeItem(assignmentId: number): void {
    this.itemsState.update(items => items.filter(item => item.assignmentId !== assignmentId));
    this.totalCountState.update(total => Math.max(0, total - 1));
  }
}
