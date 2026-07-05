import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { EMPTY, Subscription, catchError, interval, startWith, switchMap } from 'rxjs';
import { NotificationEndpointService } from '../../../../endpoints/notification-endpoints/notification-endpoint.service';
import { NotificationDto } from '../../../../endpoints/notification-endpoints/notification.models';
import { MyAuthService } from '../../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
  standalone: false
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  readonly notifications = signal<NotificationDto[]>([]);
  readonly unreadCount = signal(0);
  readonly isOpen = signal(false);

  private pollingSub?: Subscription;

  constructor(
    private notificationEndpoint: NotificationEndpointService,
    private authService: MyAuthService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      return;
    }

    this.pollingSub = interval(30_000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.notificationEndpoint.getMyNotifications().pipe(
            catchError(() => EMPTY)
          )
        )
      )
      .subscribe(result => {
        this.notifications.set(result.notifications);
        this.unreadCount.set(result.unreadCount);
      });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  toggleDropdown(): void {
    this.isOpen.update(value => !value);
  }

  markRead(notification: NotificationDto): void {
    if (notification.isRead) {
      return;
    }

    this.notificationEndpoint.markAsRead(notification.id).subscribe({
      next: () => {
        this.notifications.update(items =>
          items.map(item => item.id === notification.id ? { ...item, isRead: true } : item)
        );
        this.unreadCount.update(count => Math.max(0, count - 1));
      },
      error: () => {}
    });
  }

  markAllRead(): void {
    this.notificationEndpoint.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update(items => items.map(item => ({ ...item, isRead: true })));
        this.unreadCount.set(0);
      },
      error: () => {}
    });
  }

  typeIcon(type: string): string {
    switch (type) {
      case 'application.approved':
        return 'check_circle';
      case 'application.rejected':
        return 'cancel';
      case 'announcement.published':
        return 'campaign';
      case 'application.submitted':
        return 'assignment_ind';
      default:
        return 'notifications';
    }
  }

  timeAgo(createdAt: string): string {
    const createdAtTime = new Date(createdAt).getTime();

    if (Number.isNaN(createdAtTime)) {
      return '';
    }

    const diffMinutes = Math.floor((Date.now() - createdAtTime) / 60_000);

    if (diffMinutes < 1) {
      return 'just now';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return `${Math.floor(diffHours / 24)}d ago`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
