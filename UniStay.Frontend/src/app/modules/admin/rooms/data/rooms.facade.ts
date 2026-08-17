import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RoomCreateEndpointService } from '../../../../endpoints/room-endpoints/room-create-endpoint.service';
import { RoomDeleteEndpointService } from '../../../../endpoints/room-endpoints/room-delete-endpoint.service';
import { RoomGetAllEndpointService } from '../../../../endpoints/room-endpoints/room-get-all-endpoint.service';
import { RoomGetByIdEndpointService } from '../../../../endpoints/room-endpoints/room-get-by-id-endpoint.service';
import { RoomUpdateEndpointService } from '../../../../endpoints/room-endpoints/room-update-endpoint.service';
import { AdminRoomCreateRequest, AdminRoomUpdateRequest } from './rooms.models';
import { RoomsStore } from './rooms.store';

@Injectable()
export class RoomsFacade {
  private readonly getAllService = inject(RoomGetAllEndpointService);
  private readonly getByIdService = inject(RoomGetByIdEndpointService);
  private readonly createService = inject(RoomCreateEndpointService);
  private readonly updateService = inject(RoomUpdateEndpointService);
  private readonly deleteService = inject(RoomDeleteEndpointService);
  private readonly store = inject(RoomsStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly rooms = this.store.rooms;
  readonly totalCount = this.store.totalCount;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly filters = this.store.filters;
  readonly hasRooms = this.store.hasRooms;
  readonly isEmpty = this.store.isEmpty;

  loadRooms(): void {
    const filters = this.store.filters();
    this.store.setLoading(true);
    this.store.setError(null);

    this.getAllService.getAllRooms(
      { q: filters.search },
      filters.page,
      filters.pageSize
    ).subscribe({
      next: result => {
        this.store.setResult(result.items ?? [], result.totalItems ?? result.items?.length ?? 0);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError(this.t('ADMIN.ROOMS.LOAD_ERROR'));
        this.store.setLoading(false);
      }
    });
  }

  getById(id: number) {
    return this.getByIdService.getRoomById(id);
  }

  search(term: string): void {
    this.store.setFilters({ search: term, page: 1 });
    this.loadRooms();
  }

  changePage(pageIndex: number): void {
    this.store.setFilters({ page: pageIndex + 1 });
    this.loadRooms();
  }

  createRoom(request: AdminRoomCreateRequest): void {
    this.createService.createRoom(request).subscribe({
      next: () => {
        this.snackBar.open(this.t('ADMIN.ROOMS.CREATE_SUCCESS'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 });
        this.router.navigate(['/admin/rooms']);
      },
      error: () => this.snackBar.open(this.t('ADMIN.ROOMS.CREATE_ERROR'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 })
    });
  }

  updateRoom(id: number, request: AdminRoomUpdateRequest): void {
    this.updateService.updateRoom(id, request).subscribe({
      next: () => {
        this.snackBar.open(this.t('ADMIN.ROOMS.UPDATE_SUCCESS'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 });
        this.router.navigate(['/admin/rooms']);
      },
      error: () => this.snackBar.open(this.t('ADMIN.ROOMS.UPDATE_ERROR'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 })
    });
  }

  deleteRoom(id: number): void {
    this.deleteService.deleteRoom(id).subscribe({
      next: () => {
        this.store.removeRoom(id);
        this.snackBar.open(this.t('ADMIN.ROOMS.DELETE_SUCCESS'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 });
      },
      error: () => this.snackBar.open(this.t('ADMIN.ROOMS.DELETE_ERROR'), this.t('ADMIN.ROOMS.CLOSE'), { duration: 3500 })
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
