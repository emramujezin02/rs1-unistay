import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BedAssignCreateService } from '../../../../endpoints/bed-assignment-endpoints/bed-assignment-create-endpoint.service';
import { BedAssignDeleteService } from '../../../../endpoints/bed-assignment-endpoints/bed-assignment-delete-endpoint.service';
import { BedAssignGetAllService } from '../../../../endpoints/bed-assignment-endpoints/bed-assignment-get-all-endpoint.service';
import { AssignBedRequest, BedAssignmentsResponse, mapBedAssignment } from './bed-assignments.models';
import { BedAssignmentsStore } from './bed-assignments.store';

@Injectable()
export class BedAssignmentsFacade {
  private readonly getAllService = inject(BedAssignGetAllService);
  private readonly createService = inject(BedAssignCreateService);
  private readonly deleteService = inject(BedAssignDeleteService);
  private readonly store = inject(BedAssignmentsStore);
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
    const params = {
      'Paging.Page': filters.page,
      'Paging.PageSize': filters.pageSize,
      q: filters.search
    };

    this.store.setLoading(true);
    this.store.setError(null);
    this.getAllService.getAll(params).subscribe({
      next: (response: BedAssignmentsResponse) => {
        const items = (response.items ?? []).map(mapBedAssignment);
        this.store.setResult(items, response.totalItems ?? response.totalCount ?? items.length);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError(this.t('LOAD_ERROR'));
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

  assign(request: AssignBedRequest): void {
    this.createService.assign(request).subscribe({
      next: () => {
        this.snackBar.open(this.t('ASSIGN_SUCCESS'), this.t('CLOSE'), { duration: 4000 });
        this.load();
      },
      error: () => this.snackBar.open(this.t('ASSIGN_ERROR'), this.t('CLOSE'), { duration: 4000 })
    });
  }

  release(assignmentId: number): void {
    this.deleteService.unassign(assignmentId).subscribe({
      next: () => {
        this.store.removeItem(assignmentId);
        this.snackBar.open(this.t('RELEASE_SUCCESS'), this.t('CLOSE'), { duration: 4000 });
      },
      error: () => this.snackBar.open(this.t('RELEASE_ERROR'), this.t('CLOSE'), { duration: 4000 })
    });
  }

  private t(key: string): string {
    return this.translate.instant(`ADMIN.BED_ASSIGNMENTS.${key}`);
  }
}
