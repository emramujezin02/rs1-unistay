import { Component, OnInit, ViewChild, effect, signal } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoomGetAllEndpointService } from '../../../endpoints/room-endpoints/room-get-all-endpoint.service';
import { RoomDto } from '../../../endpoints/room-endpoints/room.models';

@Component({
  selector: 'app-employee-rooms',
  templateUrl: './employee-rooms.component.html',
  styleUrls: ['./employee-rooms.component.scss'],
  standalone: false
})
export class EmployeeRoomsComponent implements OnInit {
  readonly rooms = signal<RoomDto[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(true);

  readonly displayedColumns = ['roomNumber', 'floor', 'occupancy', 'availability', 'description'];
  readonly dataSource = new MatTableDataSource<RoomDto>();

  private search = '';
  private pageNumber = 1;
  private readonly pageSize = 15;

  constructor(private roomGetAllService: RoomGetAllEndpointService) {
    effect(() => {
      this.dataSource.data = this.rooms();
    });
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!sort) {
      return;
    }

    this.dataSource.sortingDataAccessor = (room: RoomDto, property: string) => {
      switch (property) {
        case 'occupancy':
          return room.occupiedBeds ?? 0;
        case 'availability':
          return room.availableBeds ?? 0;
        default:
          return (room as any)[property] ?? '';
      }
    };
    this.dataSource.sort = sort;
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  onSearch(term: string): void {
    this.search = term;
    this.pageNumber = 1;
    this.loadRooms();
  }

  onPageChange(pageIndex: number): void {
    this.pageNumber = pageIndex + 1;
    this.loadRooms();
  }

  get currentPage(): number {
    return this.pageNumber - 1;
  }

  get ps(): number {
    return this.pageSize;
  }

  occupiedBeds(room: RoomDto): number {
    return room.occupiedBeds ?? 0;
  }

  availableBeds(room: RoomDto): number {
    return room.availableBeds ?? Math.max(room.maxOccupancy - this.occupiedBeds(room), 0);
  }

  private loadRooms(): void {
    this.loading.set(true);
    this.roomGetAllService
      .getAllRooms({ q: this.search }, this.pageNumber, this.pageSize)
      .subscribe({
        next: result => {
          this.rooms.set(result.items ?? []);
          this.totalCount.set(result.totalItems ?? result.items?.length ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.rooms.set([]);
          this.totalCount.set(0);
          this.loading.set(false);
        }
      });
  }
}
