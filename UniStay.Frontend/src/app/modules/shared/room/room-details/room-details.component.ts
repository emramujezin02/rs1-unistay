import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../../endpoints/favorite/favorite-endpoint.service';
import { ReviewService } from '../../../../endpoints/review-and-react/review-and-react-endpoint.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoomGetByIdEndpointService } from '../../../../endpoints/room-endpoints/room-get-by-id-endpoint.service';
import { DEFAULT_ROOM_IMAGE_URL, mapRoomDtoToViewModel } from '../../../../endpoints/room-endpoints/room.models';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    private reviewService: ReviewService
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

    const queryParams: any = {
      roomId: this.room.roomID,
      roomNumber: this.room.roomNumber
    };
    const roomType = this.room.roomType ?? this.room.type;

    if (roomType) {
      queryParams.roomType = roomType;
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
        error: err => console.log('error:', err)
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
        error: err => console.log('erorr', err)
      });
  }

  private normalizeReview(review: any) {
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

