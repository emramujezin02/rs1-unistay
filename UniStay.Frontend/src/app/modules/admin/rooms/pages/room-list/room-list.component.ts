import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminRoom } from '../../data/rooms.models';
import { RoomsFacade } from '../../data/rooms.facade';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DEFAULT_ROOM_IMAGE_URL, normalizeRoomImageUrl } from '../../../../../endpoints/room-endpoints/room.models';

interface AdminRoomImageFallbacks extends AdminRoom {
  Images?: string[];
  roomImages?: { imageUrl?: string; ImageUrl?: string }[];
  RoomImages?: { ImageUrl?: string }[];
  imageUrl?: string;
  ImageUrl?: string;
}
@Component({
  selector: 'app-admin-room-list',
  standalone: false,
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {
  readonly displayedColumns = ['room', 'building', 'capacity', 'occupancy', 'status', 'actions'];
  readonly dataSource = new MatTableDataSource<AdminRoom>();
readonly defaultRoomImageUrl = DEFAULT_ROOM_IMAGE_URL;

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!sort) {
      return;
    }

    this.dataSource.sortingDataAccessor = (room: AdminRoom, property: string) => {
      switch (property) {
        case 'room':
          return room.roomNumber;
        case 'occupancy':
          return room.occupiedBeds ?? 0;
        case 'capacity':
          return room.maxOccupancy ?? 0;
        case 'status':
          return room.availableBeds ?? 0;
        default:
          return '';
      }
    };
    this.dataSource.sort = sort;
  }

  constructor(
    public facade: RoomsFacade,
    private router: Router,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    effect(() => {
      this.dataSource.data = this.facade.rooms();
    });
  }

  ngOnInit(): void {
    this.facade.loadRooms();
  }

firstRoomImage(room: AdminRoom): string {
  const roomWithFallbacks = room as AdminRoomImageFallbacks;
  const image =
    roomWithFallbacks.images?.[0] ??
    roomWithFallbacks.Images?.[0] ??
    roomWithFallbacks.roomImages?.[0]?.imageUrl ??
    roomWithFallbacks.roomImages?.[0]?.ImageUrl ??
    roomWithFallbacks.RoomImages?.[0]?.ImageUrl ??
    roomWithFallbacks.imageUrl ??
    roomWithFallbacks.ImageUrl ??
    '';

  return normalizeRoomImageUrl(image);
}

getRoomImage(room: AdminRoom): string {
  return room.images?.length
    ? normalizeRoomImageUrl(room.images[0])
    : this.defaultRoomImageUrl;
}

onImageError(event: Event): void {
  const image = event.target as HTMLImageElement;
  image.src = this.defaultRoomImageUrl;
}

  createRoom(): void {
    this.router.navigate(['/admin/rooms/new']);
  }

  viewRoom(room: AdminRoom): void {
    this.router.navigate(['/room-details', room.id]);
  }

  editRoom(room: AdminRoom): void {
    this.router.navigate(['/admin/rooms', room.id, 'edit']);
  }

  deleteRoom(room: AdminRoom): void {
    const message = this.translate.instant('ADMIN.ROOMS.DELETE_CONFIRM', { roomNumber: room.roomNumber });
    this.dialog.open(ConfirmDialogComponent, {
      data: { message }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.facade.deleteRoom(room.id);
      }
    });
  }

  statusColor(room: AdminRoom): string {
    return (room.availableBeds ?? 0) > 0 ? 'primary' : 'warn';
  }
}
