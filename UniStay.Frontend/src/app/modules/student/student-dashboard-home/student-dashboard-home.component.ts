import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementEndpointService } from '../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../endpoints/announcement-endpoints/announcement.models';
import { ApplicationFacadeService } from '../../../endpoints/application-endpoints/application-facade.service';

interface DashboardCard {
  titleKey: string;
  descriptionKey: string;
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
  currentNotificationIndex = 0;

  readonly cards: DashboardCard[] = [
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.SEARCH_ROOMS_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.SEARCH_ROOMS_DESC',
      icon: 'meeting_room',
      color: 'blue',
      route: '/student/rooms'
    },
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.INVOICES_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.INVOICES_DESC',
      icon: 'payments',
      color: 'green',
      route: '/student/invoices'
    },
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.FAVORITES_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.FAVORITES_DESC',
      icon: 'favorite_border',
      color: 'amber',
      route: '/student/favorites'
    },
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.INVITE_FRIEND_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.INVITE_FRIEND_DESC',
      icon: 'person_add',
      color: 'blue',
      route: '/student/invite-friend'
    },
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.SECURITY_QUESTIONS_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.SECURITY_QUESTIONS_DESC',
      icon: 'security',
      color: 'green',
      route: '/student/security-questions'
    },
    {
      titleKey: 'STUDENT.DASHBOARD_HOME.CARDS.CHAT_TITLE',
      descriptionKey: 'STUDENT.DASHBOARD_HOME.CARDS.CHAT_DESC',
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

  get greetingKey(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'STUDENT.DASHBOARD_HOME.GREETING.MORNING';
    }
    if (hour < 18) {
      return 'STUDENT.DASHBOARD_HOME.GREETING.AFTERNOON';
    }
    return 'STUDENT.DASHBOARD_HOME.GREETING.EVENING';
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

  get selectedNotification(): AnnouncementDto | null {
    return this.announcements()[this.currentNotificationIndex] ?? null;
  }

  get hasMultipleNotifications(): boolean {
    return this.announcements().length > 1;
  }

  nextNotification(): void {
    const total = this.announcements().length;
    if (total <= 1) {
      return;
    }

    this.currentNotificationIndex = (this.currentNotificationIndex + 1) % total;
  }

  previousNotification(): void {
    const total = this.announcements().length;
    if (total <= 1) {
      return;
    }

    this.currentNotificationIndex = (this.currentNotificationIndex - 1 + total) % total;
  }

  goToNotification(index: number): void {
    if (index < 0 || index >= this.announcements().length) {
      return;
    }

    this.currentNotificationIndex = index;
  }

  private loadAnnouncements(): void {
    this.loadingAnnouncements.set(true);
    this.announcementEndpoint.getAll(1, 3, ANNOUNCEMENT_AUDIENCES.STUDENT).subscribe({
      next: result => {
        this.announcements.set(result.items);
        this.currentNotificationIndex = 0;
        this.loadingAnnouncements.set(false);
      },
      error: () => {
        this.announcements.set([]);
        this.currentNotificationIndex = 0;
        this.loadingAnnouncements.set(false);
      }
    });
  }
}
