import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicRoomEndpointService } from '../../../../endpoints/public-room-endpoints/public-room-endpoint.service';
import { PublicRoomBed, PublicRoomDetail, PublicRoomReview } from '../../../../endpoints/public-room-endpoints/public-room.models';
import { ReviewService } from '../../../../endpoints/review-and-react/review-and-react-endpoint.service';

@Component({
  selector: 'app-public-room-detail',
  templateUrl: './public-room-detail.component.html',
  styleUrl: './public-room-detail.component.scss',
  standalone: false
})
export class PublicRoomDetailComponent implements OnInit {
  readonly room = signal<PublicRoomDetail | null>(null);
  readonly reviews = signal<PublicRoomReview[]>([]);
  readonly loading = signal(true);
  readonly reviewsLoading = signal(false);
  readonly notFound = signal(false);
  readonly selectedImage = signal<string | null>(null);
  readonly currentIndex = signal(0);
  readonly zoomed = signal(false);

  constructor(
    private publicRoomsEndpoint: PublicRoomEndpointService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.publicRoomsEndpoint.getById(id).subscribe({
      next: response => {
        const images = response.images ?? [];
        this.room.set({
          ...response,
          images,
          beds: response.beds ?? []
        });
        this.selectedImage.set(images[0] ?? null);
        this.currentIndex.set(0);
        this.loading.set(false);
        this.loadReviews(id);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/rooms']);
  }

  isBedOccupied(bed: PublicRoomBed): boolean {
    const today = new Date().toISOString().slice(0, 10);

    return (bed.assignments ?? []).some(assignment => {
      const fromDate = assignment.fromDate.slice(0, 10);
      const toDate = assignment.toDate.slice(0, 10);

      return fromDate <= today && toDate >= today;
    });
  }

  setSelectedImage(image: string, index: number): void {
    this.selectedImage.set(image);
    this.currentIndex.set(index);
  }

  nextImage(): void {
    const images = this.room()?.images ?? [];
    if (!images.length) return;

    const next = (this.currentIndex() + 1) % images.length;
    this.setSelectedImage(images[next], next);
  }

  prevImage(): void {
    const images = this.room()?.images ?? [];
    if (!images.length) return;

    const prev = (this.currentIndex() - 1 + images.length) % images.length;
    this.setSelectedImage(images[prev], prev);
  }

  toggleZoom(): void {
    this.zoomed.update(value => !value);
  }

  reviewId(review: PublicRoomReview): number | undefined {
    return review.roomReviewID ?? review.roomReviewId;
  }

  private loadReviews(roomId: number): void {
    this.reviewsLoading.set(true);

    this.reviewService.getReviews(roomId).subscribe({
      next: reviews => {
        this.reviews.set(reviews ?? []);
        this.reviewsLoading.set(false);
      },
      error: () => {
        this.reviews.set([]);
        this.reviewsLoading.set(false);
      }
    });
  }
}
