import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../../endpoints/favorite/favorite-endpoint.service';
import { ReviewService } from '../../../../endpoints/review-and-react/review-and-react-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoomGetByIdEndpointService } from '../../../../endpoints/room-endpoints/room-get-by-id-endpoint.service';
import { DEFAULT_ROOM_IMAGE_URL, mapRoomDtoToViewModel, RoomViewModel } from '../../../../endpoints/room-endpoints/room.models';
import { RoomReview } from '../../../../endpoints/review-and-react/review-and-react.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  room: RoomViewModel | null = null;
  selectedImage: string = DEFAULT_ROOM_IMAGE_URL;
  readonly defaultRoomImageUrl = DEFAULT_ROOM_IMAGE_URL;
  zoomed = false;
  currentIndex = 0;
  isFavorite = false;
  reviews: RoomReview[] = [];
  reviewForm = new FormGroup({
    comment: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(1000)
      ]
    }),
    rating: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]
    })
  });
  isSelectionMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomGetByIdService: RoomGetByIdEndpointService,
    private favoriteService: FavoritesService,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isSelectionMode = this.route.snapshot.queryParamMap.get('selecting') === 'true';
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

  goBackToRooms() {
    this.router.navigate(['/student/rooms'], {
      queryParams: this.isSelectionMode ? { selecting: 'true' } : undefined
    });
  }

  applyForRoom() {
    if (!this.room || !this.isSelectionMode) return;

    const queryParams: Record<string, string | number> = {
      roomId: this.room.roomID,
      roomNumber: this.room.roomNumber
    };
    const roomWithLegacyType = this.room as RoomViewModel & { roomType?: string | null; type?: string | null };
    const roomType = roomWithLegacyType.roomType ?? roomWithLegacyType.type;

    if (roomType) {
      queryParams['roomType'] = roomType;
    }

    this.router.navigate(['/student/apply'], { queryParams });
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
          this.snackBar.open('Added to favorites', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Already in favorites', 'OK', { duration: 3000 })
      });
  }

  removeFavorite() {
    if (!this.room) return;

    this.favoriteService.remove(this.room.roomID)
      .subscribe(() => {
        this.isFavorite = false;
        this.snackBar.open('Removed from favorites', 'OK', { duration: 3000 });
      });
  }

  private loadFavoriteStatus() {
    this.favoriteService.getMy().subscribe({
      next: favorites => {
        this.isFavorite = favorites.some(favorite =>
          (favorite.roomID ?? favorite.roomId ?? favorite.id) === this.room?.roomID
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
      return;
    }

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const comment = this.commentControl.value.trim();
    const rating = this.ratingControl.value;

    this.reviewService.addReview({
      RoomID: this.room.roomID,
      Rating: rating,
      Comment: comment
    })
      .subscribe({
        next: () => {
          this.reviewForm.reset({
            comment: '',
            rating: 0
          });
          this.loadReviews();
        },
        error: err => console.error('Error adding review', err)
      });
  }

  setRating(rating: number) {
    this.ratingControl.setValue(rating);
    this.ratingControl.markAsTouched();
  }

  get commentControl(): FormControl<string> {
    return this.reviewForm.controls.comment;
  }

  get ratingControl(): FormControl<number> {
    return this.reviewForm.controls.rating;
  }

  react(reviewId: number, isLike: boolean) {
    if (!reviewId) return;

    this.reviewService.react({
      ReviewID: reviewId,
      IsLike: isLike
    })
      .subscribe({
        next: () => {
          this.loadReviews();
        },
        error: err => console.error('Error reacting to review', err)
      });
  }

  private normalizeReview(review: RoomReview): RoomReview {
    const roomReviewID = review.roomReviewID ?? review.roomReviewId ?? review.RoomReviewID;
    const userReaction = review.userReaction ?? review.UserReaction;

    return {
      ...review,
      roomReviewID,
      likes: review.likes ?? review.Likes ?? 0,
      dislikes: review.dislikes ?? review.Dislikes ?? 0,
      userReaction
    };
  }
}

