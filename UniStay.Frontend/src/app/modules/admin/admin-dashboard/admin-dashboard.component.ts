import { Component, OnDestroy, OnInit } from '@angular/core';
import { prepareRoute, routeTransition } from '../../../shared/animations/route-animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalyticsService, AnalyticsSnapshot } from '../../../endpoints/analytics/analytics.service';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

interface AdminDashboardNavItem {
  title: string;
  icon: string;
  route: string;
}

interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  totalMessages: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone:false,
  animations: [routeTransition]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  readonly prepareRoute = prepareRoute;
  statsLoading = true;
  statsError = false;
  stats: DashboardStats = this.createEmptyStats();
  private analyticsSub?: Subscription;

  readonly menuItems: AdminDashboardNavItem[] = [
    { title: 'Statistics', icon: 'bar_chart', route: '/admin' },
    { title: 'Hall list', icon: 'apartment', route: '/admin/hall/hall-list' },
    { title: 'Rooms', icon: 'meeting_room', route: '/admin/rooms' },
    { title: 'Faults', icon: 'construction', route: '/admin/fault/fault-list' },
    { title: 'Equipment', icon: 'inventory_2', route: '/admin/equipment/equipment-list' },
    { title: 'Applications', icon: 'assignment', route: '/admin/applications' },
    { title: 'Users', icon: 'group', route: '/admin/users' },
    { title: 'Invite users', icon: 'person_add', route: '/admin/invites' },
    { title: 'Payments', icon: 'payments', route: '/admin/payments' },
    { title: 'Announcements', icon: 'campaign', route: '/admin/announcements' },
    { title: 'Bed assignments', icon: 'bed', route: '/admin/bed-assignments' },
    { title: 'Hall Reservations', icon: 'event_available', route: '/admin/hall-reservations' },
    { title: 'Webhooks', icon: 'webhook', route: '/admin/webhooks' },
    { title: 'Chat', icon: 'chat_bubble_outline', route: '/admin/chat' },
    { title: 'Security Questions', icon: 'security', route: '/admin/security-questions' },
    { title: 'Settings', icon: 'tune', route: '/admin/settings' }
  ];

  constructor(
    private authService: MyAuthService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {console.log("Dashboard loaded");}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  ngOnDestroy(): void {
    this.analyticsSub?.unsubscribe();
    this.analyticsService.stopConnection();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    const currentUrl = this.normalizedCurrentUrl;
    if (route === '/admin') {
      return this.isStatisticsRoute;
    }

    return currentUrl === route || currentUrl.startsWith(route + '/');
  }

  get isStatisticsRoute(): boolean {
    const currentUrl = this.normalizedCurrentUrl;
    return currentUrl === '/admin' || currentUrl === '/admin/admin-dashboard';
  }

  get userEmail(): string {
    return localStorage.getItem('email') ?? '';
  }

  get userInitial(): string {
    return (this.userEmail || 'A').charAt(0).toUpperCase();
  }

  private get normalizedCurrentUrl(): string {
    return this.router.url.split('?')[0].split('#')[0].replace(/\/$/, '');
  }

  openHallList(){
    this.router.navigate(['/admin/hall/hall-list']);
  }

  get userRole(){
    return localStorage.getItem('role');
  }

  openFaultList(){
    this.router.navigate(['/admin/fault/fault-list']);
  }

    openEquipmentList(){
    this.router.navigate(['/admin/equipment/equipment-list']);
  }

  private loadDashboardStats(): void {
    this.statsLoading = true;
    this.statsError = false;

    this.analyticsSub = this.analyticsService.analytics$.subscribe(data => {
      this.stats = this.normalizeStats(data);
      this.statsLoading = false;
      this.statsError = false;
    });

    const userId = Number(localStorage.getItem('id'));
    if (userId) {
      this.analyticsService.startConnection(userId);
    }

    this.analyticsService.getSnapshot().subscribe({
      next: data => {
        this.stats = this.normalizeStats(data);
        this.statsLoading = false;
      },
      error: () => {
        this.stats = this.createEmptyStats();
        this.statsError = true;
        this.statsLoading = false;
      }
    });
  }

  private normalizeStats(snapshot: Partial<AnalyticsSnapshot> | null | undefined): DashboardStats {
    return {
      activeUsers: snapshot?.activeUsers ?? 0,
      totalUsers: snapshot?.totalUsers ?? 0,
      totalMessages: snapshot?.totalMessages ?? 0
    };
  }

  private createEmptyStats(): DashboardStats {
    return {
      activeUsers: 0,
      totalUsers: 0,
      totalMessages: 0
    };
  }

}

