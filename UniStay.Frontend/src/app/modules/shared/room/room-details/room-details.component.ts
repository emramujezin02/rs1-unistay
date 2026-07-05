import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from '../../../../endpoints/favorite/favorite-endpoint.service';
import { ReviewService } from '../../../../endpoints/review-and-react/review-and-react-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoomGetByIdEndpointService } from '../../../../endpoints/room-endpoints/room-get-by-id-endpoint.service';
import { DEFAULT_ROOM_IMAGE_URL, mapRoomDtoToViewModel } from '../../../../endpoints/room-endpoints/room.models';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class RoomDetailsComponent implements OnInit {

  room: any;
  selectedImage: string = DEFAULT_ROOM_IMAGE_URL;
  readonly defaultRoomImageUrl = DEFAULT_ROOM_IMAGE_URL;
  zoomed = false;
  currentIndex = 0;
  isFavorite = false;
  reviews: any[] = [];
  comment = '';
  rating: number = 0;
  private userReactionsByReviewId: Record<number, boolean | undefined> = {};

  constructor(
    private route: ActivatedRoute,
    private roomGetByIdService: RoomGetByIdEndpointService,
    private favoriteService: FavoritesService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    
    this.roomGetByIdService.getRoomById(id)
      .subscribe((res) => {
        this.room = mapRoomDtoToViewModel(res);

        if (this.room.images.length > 0) {
          this.currentIndex = 0;
          this.selectedImage = this.room.images[0];
        } else {
          this.selectedImage = this.defaultRoomImageUrl;
        }

        this.loadFavoriteStatus();
        this.loadReviews();
      });
  }

  nextImage() {
    if (!this.room?.images?.length) return;

    this.currentIndex =
      (this.currentIndex + 1) % this.room.images.length;

    this.selectedImage = this.room.images[this.currentIndex];
  }

  prevImage() {
    if (!this.room?.images?.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.room.images.length) %
      this.room.images.length;

    this.selectedImage = this.room.images[this.currentIndex];
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }

 /* onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    image.src = this.defaultRoomImageUrl;
    this.selectedImage = this.defaultRoomImageUrl;
  }*/

    onImageError(event: Event) {
  const image = event.target as HTMLImageElement;
  image.src = this.defaultRoomImageUrl;
}

  toggleZoom() {
    this.zoomed = !this.zoomed;
  }

  addToFavorites() {
    if (!this.room) return;

    this.favoriteService
      .add(this.room.roomID)
      .subscribe({
        next: () => {
          this.isFavorite = true;
          alert('Added to favorites');
        },
        error: () => alert('Already in favorites')
      });
  }

  removeFavorite() {
    if (!this.room) return;

    this.favoriteService.remove(this.room.roomID)
      .subscribe(() => {
        this.isFavorite = false;
        alert('Removed from favorites');
      });
  }

  private loadFavoriteStatus() {
    this.favoriteService.getMy().subscribe({
      next: favorites => {
        this.isFavorite = favorites.some(favorite =>
          (favorite.roomID ?? favorite.roomId ?? favorite.id) === this.room.roomID
        );
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }

  loadReviews() {
    if (!this.room) return;

    this.reviewService.getReviews(this.room.roomID)
      .subscribe(res => {
        this.reviews = res.map(review => this.normalizeReview(review));
      });
  }

  addReview() {
    if (!this.room) {
      console.log('room not loaded');
      return;
    }

    const comment = this.comment.trim();
    if (!comment || this.rating < 1 || this.rating > 5) {
      return;
    }

    this.reviewService.addReview({
      RoomID: this.room.roomID,
      Rating: this.rating,
      Comment: comment
    })
      .subscribe({
        next: () => {
          this.comment = '';
          this.rating = 0;
          this.loadReviews();
        },
        error: err => console.log('error:', err)
      });
  }

  react(reviewId: number, isLike: boolean) {
    if (!reviewId) return;

    const previousReaction = this.userReactionsByReviewId[reviewId];

    this.reviewService.react({
      ReviewID: reviewId,
      IsLike: isLike
    })
      .subscribe({
        next: () => {
          this.userReactionsByReviewId[reviewId] = previousReaction === isLike ? undefined : isLike;
          this.loadReviews();
        },
        error: err => console.log('erorr', err)
      });
  }

  private normalizeReview(review: any) {
    const roomReviewID = review.roomReviewID ?? review.roomReviewId ?? review.RoomReviewID;

    return {
      ...review,
      roomReviewID,
      likes: review.likes ?? review.Likes ?? 0,
      dislikes: review.dislikes ?? review.Dislikes ?? 0,
      userReaction: this.userReactionsByReviewId[roomReviewID] ?? review.userReaction
    };
  }
}
