import { Component, inject, Input, OnChanges, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnouncementDto } from '../../../../endpoints/announcement-endpoints/announcement.models';
import { AnnouncementDetailDialogComponent } from '../announcement-detail-dialog/announcement-detail-dialog.component';

@Component({
  selector: 'app-announcement-carousel',
  standalone: false,
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss'
})
export class AnnouncementCarouselComponent implements OnChanges {
  @Input() announcements: AnnouncementDto[] = [];
  @Input() loading = false;
  @Input() viewAllRoute?: string;

  private readonly dialog = inject(MatDialog);
  private readonly index = signal(0);

  readonly currentIndex = this.index.asReadonly();

  get hasItems(): boolean {
    return this.announcements.length > 0;
  }

  get current(): AnnouncementDto | undefined {
    return this.announcements[this.index()];
  }

  get dots(): number[] {
    return this.announcements.map((_, i) => i);
  }

  ngOnChanges(): void {
    this.index.set(0);
  }

  next(): void {
    const length = this.announcements.length;
    if (length === 0) {
      return;
    }

    this.index.update(value => (value + 1) % length);
  }

  prev(): void {
    const length = this.announcements.length;
    if (length === 0) {
      return;
    }

    this.index.update(value => (value - 1 + length) % length);
  }

  goTo(index: number): void {
    this.index.set(index);
  }

  openDetail(announcement: AnnouncementDto): void {
    this.dialog.open(AnnouncementDetailDialogComponent, {
      data: announcement,
      width: '580px',
      maxWidth: '95vw'
    });
  }
}
