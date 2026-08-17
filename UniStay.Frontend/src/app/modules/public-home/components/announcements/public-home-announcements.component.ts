import { Component, OnInit, computed, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AnnouncementEndpointService } from '../../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../../endpoints/announcement-endpoints/announcement.models';

@Component({
  selector: 'app-public-home-announcements',
  standalone: false,
  templateUrl: './public-home-announcements.component.html',
  styleUrl: './public-home-announcements.component.scss'
})
export class PublicHomeAnnouncementsComponent implements OnInit {
  private readonly fallback: AnnouncementDto[] = [
    {
      announcementId: 'welcome-week',
      title: 'Welcome Week Schedule',
      content: 'Meet your residential community and discover student housing services during welcome week.',
      audience: 'Everyone',
      createdAt: '2024-08-15',
      createdByUserId: '',
      createdByUsername: 'UniStay'
    }
  ];

  readonly announcements = signal<AnnouncementDto[]>(this.fallback);
  readonly index = signal(0);
  readonly current = computed(() => this.announcements()[this.index()]);

  constructor(private announcementEndpoint: AnnouncementEndpointService) {}

  ngOnInit(): void {
    this.announcementEndpoint.getAll(1, 5, ANNOUNCEMENT_AUDIENCES.PUBLIC)
      .pipe(catchError(() => of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 5, totalPages: 0 })))
      .subscribe(result => {
        if (result.items.length > 0) {
          this.announcements.set(result.items);
          this.index.set(0);
        }
      });
  }

  next(): void {
    this.index.update(value => (value + 1) % this.announcements().length);
  }

  prev(): void {
    this.index.update(value => (value - 1 + this.announcements().length) % this.announcements().length);
  }

  formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
