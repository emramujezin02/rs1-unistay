import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PublicRoomEndpointService } from '../../../../endpoints/public-room-endpoints/public-room-endpoint.service';
import { PublicRoom } from '../../../../endpoints/public-room-endpoints/public-room.models';

@Component({
  selector: 'app-public-rooms',
  templateUrl: './public-rooms.component.html',
  styleUrl: './public-rooms.component.scss',
  standalone: false
})
export class PublicRoomsComponent implements OnInit {
  readonly rooms = signal<PublicRoom[]>([]);
  readonly loading = signal(true);
  currentPage = 1;
  readonly pageSize = 9;

  floorFilter: number | null = null;
  maxOccupancyFilter: number | null = null;
  nearExitFilter = false;
  wheelchairAccessibleFilter = false;
  elevatorAccessFilter = false;

  constructor(
    private publicRoomsEndpoint: PublicRoomEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.publicRoomsEndpoint.getAll({
      floor: this.floorFilter,
      maxOccupancy: this.maxOccupancyFilter,
      nearExit: this.nearExitFilter,
      wheelchairAccessible: this.wheelchairAccessibleFilter,
      elevatorAccess: this.elevatorAccessFilter,
      page: 1,
      pageSize: 1000
    }).subscribe({
      next: response => {
        this.rooms.set(response.items ?? []);
        this.currentPage = this.totalPages > 0
          ? Math.min(this.currentPage, this.totalPages)
          : 1;
        this.loading.set(false);
      },
      error: () => {
        this.rooms.set([]);
        this.loading.set(false);
      }
    });
  }

  onFloorFilter(): void {
    this.resetPagination();
    this.load();
  }

  onFilterChange(): void {
    this.resetPagination();
    this.load();
  }

  get totalPages(): number {
    return Math.ceil(this.rooms().length / this.pageSize);
  }

  getCurrentPageRooms(): PublicRoom[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.rooms().slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  private resetPagination(): void {
    this.currentPage = 1;
  }

  viewDetail(roomId: number): void {
    this.router.navigate(['/rooms', roomId]);
  }

}
