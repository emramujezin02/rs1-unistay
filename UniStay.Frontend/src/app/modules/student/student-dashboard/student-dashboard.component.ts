import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { UserGetByIdEndpointService } from '../../../endpoints/user-endpoints/user-get-by-id-endpoint.service';
import {filter, Observable, Subscription} from 'rxjs';
import { ApplicationFacadeService } from '../../../endpoints/application-endpoints/application-facade.service';

interface StudentNavItem {
  path: string;
  icon: string;
  label: string;
  requiresApproval: boolean;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone:false
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  readonly isApproved = computed(() => this.applicationFacade.applicationStatus() === 'Approved');
  private routerSub?: Subscription;

  constructor(
    private authService: MyAuthService,
    private router: Router,
    private userGetByIdEndpoint: UserGetByIdEndpointService,
    private applicationFacade: ApplicationFacadeService
  ) {console.log("Dashboard je ucitan");}

  readonly navItems = signal<StudentNavItem[]>([
    { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard', requiresApproval: false },
    { path: '/student/rooms', icon: 'search', label: 'Search Rooms', requiresApproval: false },
    { path: '/student/favorites', icon: 'favorite_border', label: 'Favorites', requiresApproval: false },
    { path: '/student/invite-friend', icon: 'person_add', label: 'Invite Friend', requiresApproval: false },
    { path: '/student/security-questions', icon: 'security', label: 'Security Questions', requiresApproval: false },
    { path: '/student/invoices', icon: 'receipt_long', label: 'Invoices', requiresApproval: true },
    { path: '/student/payments', icon: 'payments', label: 'Payments', requiresApproval: true },
    { path: '/student/chat', icon: 'chat_bubble_outline', label: 'Chat', requiresApproval: false },
    { path: '/student/settings', icon: 'tune', label: 'Settings', requiresApproval: false }
  ]);
  user$!: Observable<any>;
  private currentUrl = signal('');

  ngOnInit() {
    this.currentUrl.set(this.router.url);
    this.user$ = this.authService.user$;
    if (!this.authService.getUser()) {
      const id = localStorage.getItem('id');
      if (id) {
        this.userGetByIdEndpoint.getById(+id)
          .subscribe(user => this.authService.setUser(user));
      }
    }

    this.applicationFacade.loadMyApplications().subscribe();
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.currentUrl.set((event as NavigationEnd).urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  visibleNavItems(): StudentNavItem[] {
    return this.navItems().filter(item => !item.requiresApproval || this.isApproved());
  }

  isActive(path: string): boolean {
    const url = this.currentUrl();
    return url === path || url.startsWith(path + '/');
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  get userInitial(): string {
    const email = this.userEmail || '?';
    return email.charAt(0).toUpperCase();
  }

  get userEmail(): string {
    const user = this.authService.getUser();
    return user?.email ?? user?.username ?? user?.firstName ?? user?.firstname ?? localStorage.getItem('email') ?? '';
  }
}
