import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoomGetAllEndpointService } from '../../../../endpoints/room-endpoints/room-get-all-endpoint.service';
import { DEFAULT_ROOM_IMAGE_URL, mapRoomDtoToViewModel, normalizeRoomImageUrl, RoomListFilters, RoomViewModel } from '../../../../endpoints/room-endpoints/room.models';
import { FavoritesService, FavoriteRoomDto } from '../../../../endpoints/favorite/favorite-endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('1000ms ease',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class RoomListComponent implements OnInit {

  rooms: RoomViewModel[] = [];
  readonly defaultRoomImageUrl = DEFAULT_ROOM_IMAGE_URL;
  gender = '';
  capacity?: number;
  searchTerm = '';
  totalItems = 0;
  pageNumber = 1;
  pageSize = 10;
  private readonly favoriteRoomIds = new Set<number>();

  filters: RoomListFilters = {
    floor: null,
    maxOccupancy: null,
    nearExit: false,
    wheelchairAccessible: false,
    elevatorAccess: false
  };

  constructor(
    private roomGetAllService: RoomGetAllEndpointService,
    private favoriteService: FavoritesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.loadFavoriteStatus();
    this.loadRooms();
  }

  loadRooms() {
    const params: RoomListFilters = {};

    if (this.searchTerm.trim())
      params.q = this.searchTerm.trim();

    if (this.filters.floor)
      params.floor = this.filters.floor;

    if (this.filters.nearExit)
      params.nearExit = true;

    if (this.filters.wheelchairAccessible)
      params.wheelchairAccessible = true;

    if (this.filters.elevatorAccess)
      params.elevatorAccess = true;

    if (this.filters.maxOccupancy)
      params.maxOccupancy = this.filters.maxOccupancy;

    this.roomGetAllService.getAllRooms(params, this.pageNumber, this.pageSize)
      .subscribe(res => {
        this.rooms = res.items.map(mapRoomDtoToViewModel);
        this.totalItems = res.totalItems ?? res.items.length;
      }, err => console.error('error loading rooms', err));
  }

  getRoomImage(room: RoomViewModel): string {
  return room.images?.length
    ? normalizeRoomImageUrl(room.images[0])
    : this.defaultRoomImageUrl;
}

  onFilterChange() {
    this.pageNumber = 1;
    this.loadRooms();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.pageNumber = 1;
    this.loadRooms();
  }

  onPageChange(pageIndex: number) {
    this.pageNumber = pageIndex + 1;
    this.loadRooms();
  }

  openRoom(id: number) {
    const isStudentRooms = this.router.url.startsWith('/student/rooms');
    const navigationExtras = this.isSelectionMode()
      ? { queryParams: { selecting: 'true' } }
      : undefined;

    this.router.navigate(
      isStudentRooms ? ['/student/rooms/room-details', id] : ['/room-details', id],
      navigationExtras
    );
  }

  private isSelectionMode(): boolean {
    return this.route.snapshot.queryParamMap.get('selecting') === 'true';
  }

  isFavorite(room: RoomViewModel): boolean {
    return this.favoriteRoomIds.has(room.roomID);
  }

  toggleFavorite(room: RoomViewModel, event: Event) {
    event.stopPropagation();

    if (this.isFavorite(room)) {
      this.favoriteService.remove(room.roomID).subscribe({
        next: () => {
          this.favoriteRoomIds.delete(room.roomID);
          this.snackBar.open('Removed from favorites', 'Close', { duration: 2500 });
        },
        error: () => this.snackBar.open('Favorite could not be removed', 'Close', { duration: 2500 })
      });
      return;
    }

    this.favoriteService.add(room.roomID).subscribe({
      next: () => {
        this.favoriteRoomIds.add(room.roomID);
        this.snackBar.open('Added to favorites', 'Close', { duration: 2500 });
      },
      error: () => this.snackBar.open('Room is already in favorites', 'Close', { duration: 2500 })
    });
  }

  onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    image.src = this.defaultRoomImageUrl;
  }

  private loadFavoriteStatus() {
    this.favoriteService.getMy().subscribe({
      next: favorites => {
        this.favoriteRoomIds.clear();
        favorites
          .map(favorite => this.getFavoriteRoomId(favorite))
          .filter((id): id is number => !!id)
          .forEach(id => this.favoriteRoomIds.add(id));
      },
      error: () => this.favoriteRoomIds.clear()
    });
  }

  private getFavoriteRoomId(favorite: FavoriteRoomDto): number | undefined {
    return favorite.roomID ?? favorite.roomId ?? favorite.id;
  }
}



