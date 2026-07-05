import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementEndpointService } from '../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../endpoints/announcement-endpoints/announcement.models';
import { ApplicationFacadeService } from '../../../endpoints/application-endpoints/application-facade.service';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
  route: string;
}

@Component({
  selector: 'app-student-dashboard-home',
  templateUrl: './student-dashboard-home.component.html',
  styleUrls: ['./student-dashboard-home.component.scss'],
  standalone: false
})
export class StudentDashboardHomeComponent implements OnInit {
  readonly announcements = signal<AnnouncementDto[]>([]);
  readonly loadingAnnouncements = signal(false);

  readonly cards: DashboardCard[] = [
    {
      title: 'Search rooms',
      description: 'Browse existing rs1-work room search and availability.',
      icon: 'meeting_room',
      color: 'blue',
      route: '/student/rooms'
    },
    {
      title: 'Invoices',
      description: 'Review your accommodation invoices and payment context.',
      icon: 'payments',
      color: 'green',
      route: '/student/invoices'
    },
    {
      title: 'Favorites',
      description: 'Open your saved rooms without changing favorites logic.',
      icon: 'favorite_border',
      color: 'amber',
      route: '/student/favorites'
    },
    {
      title: 'Invite friend',
      description: 'Send a UniStay invitation link to a friend by email.',
      icon: 'person_add',
      color: 'blue',
      route: '/student/invite-friend'
    },
    {
      title: 'Security questions',
      description: 'Set the account recovery questions used by the existing security flow.',
      icon: 'security',
      color: 'green',
      route: '/student/security-questions'
    },
    {
      title: 'Chat',
      description: 'Continue conversations with staff and residence contacts.',
      icon: 'chat_bubble_outline',
      color: 'purple',
      route: '/student/chat'
    }
  ];

  constructor(
    public applicationFacade: ApplicationFacadeService,
    private announcementEndpoint: AnnouncementEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationFacade.loadMyApplications().subscribe();
    this.loadAnnouncements();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }

  get userFirstName(): string {
    const email = localStorage.getItem('email') ?? '';
    const name = email.split('@')[0]?.split('.')[0];
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Student';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  goApply(): void {
    this.router.navigate(['/student/apply']);
  }

  private loadAnnouncements(): void {
    this.loadingAnnouncements.set(true);
    this.announcementEndpoint.getAll(1, 3, ANNOUNCEMENT_AUDIENCES.STUDENT).subscribe({
      next: result => {
        this.announcements.set(result.items);
        this.loadingAnnouncements.set(false);
      },
      error: () => {
        this.announcements.set([]);
        this.loadingAnnouncements.set(false);
      }
    });
  }
}
