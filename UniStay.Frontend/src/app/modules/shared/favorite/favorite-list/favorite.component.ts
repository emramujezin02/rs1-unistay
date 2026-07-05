import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService, FavoriteRoomDto } from '../../../../endpoints/favorite/favorite-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { DEFAULT_ROOM_IMAGE_URL, normalizeRoomImageUrl } from '../../../../endpoints/room-endpoints/room.models';

interface FavoriteRoomViewModel {
  roomID: number;
  roomNumber: string;
  floor?: number;
  maxOccupancy?: number;
  images: string[];
}

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
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

export class FavoritesComponent implements OnInit {
  rooms: FavoriteRoomViewModel[] = [];
  loading = false;
  errorMessage = '';
  readonly defaultRoomImageUrl = DEFAULT_ROOM_IMAGE_URL;

  constructor(private favService: FavoritesService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    this.errorMessage = '';
    this.favService.getMy()
      .subscribe({
        next: (res) => {
          this.rooms = res.map(room => this.mapFavoriteRoom(room));
          this.loading = false;
        },
        error: () => {
          this.rooms = [];
          this.loading = false;
          this.errorMessage = 'Favorites could not be loaded.';
        }
      });
  }

  openRoom(id: number) {
    this.router.navigate(['/room-details', id]);
  }

  onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    image.src = this.defaultRoomImageUrl;
  }

  private mapFavoriteRoom(room: FavoriteRoomDto): FavoriteRoomViewModel {
    return {
      roomID: room.roomID ?? room.roomId ?? room.id ?? 0,
      roomNumber: room.roomNumber,
      floor: room.floor,
      maxOccupancy: room.maxOccupancy,
      images: (room.images ?? []).map(normalizeRoomImageUrl)
    };
  }
}


