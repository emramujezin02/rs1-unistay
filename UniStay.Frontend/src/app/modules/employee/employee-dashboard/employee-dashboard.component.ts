import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { AnnouncementEndpointService } from '../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../endpoints/announcement-endpoints/announcement.models';

interface DashboardAction {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'teal' | 'red';
  route: string;
}

interface DashboardNavItem {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone:false
})
export class EmployeeDashboardComponent implements OnInit {
  readonly announcements = signal<AnnouncementDto[]>([]);
  readonly loadingAnnouncements = signal(false);

  readonly primaryActions: DashboardAction[] = [
    {
      title: 'Room management',
      description: 'Browse dorm rooms, availability, and occupancy details.',
      icon: 'meeting_room',
      color: 'teal',
      route: '/employee/rooms'
    },
    {
      title: 'Student records',
      description: 'Search student accounts and review contact records.',
      icon: 'group',
      color: 'green',
      route: '/employee/students'
    },
    {
      title: 'Hall list',
      description: 'Review residence halls and availability details.',
      icon: 'business',
      color: 'blue',
      route: '/employee/hall/hall-list'
    },
    {
      title: 'Hall reservations',
      description: 'Review hall booking requests and approve or reject pending reservations.',
      icon: 'event_available',
      color: 'teal',
      route: '/employee/hall-reservations'
    },
    {
      title: 'Invite friend',
      description: 'Send a UniStay invitation link to a friend by email.',
      icon: 'person_add',
      color: 'blue',
      route: '/employee/invite-friend'
    },
    {
      title: 'Fault list',
      description: 'Track reported maintenance requests and statuses.',
      icon: 'build',
      color: 'amber',
      route: '/employee/fault/fault-list'
    },
    {
      title: 'Equipment list',
      description: 'Check equipment inventory and assigned items.',
      icon: 'inventory_2',
      color: 'green',
      route: '/employee/equipment/equipment-list'
    },
    {
      title: 'Chat',
      description: 'Continue conversations with students and staff.',
      icon: 'chat_bubble_outline',
      color: 'purple',
      route: '/employee/chat'
    },
    {
      title: 'Security questions',
      description: 'Set account recovery questions using the shared security flow.',
      icon: 'security',
      color: 'red',
      route: '/employee/security-questions'
    }
  ];

  readonly panelNavItems: DashboardNavItem[] = [
    { title: 'Dashboard', icon: 'dashboard', route: '/employee' },
    { title: 'Room management', icon: 'meeting_room', route: '/employee/rooms' },
    { title: 'Student records', icon: 'group', route: '/employee/students' },
    { title: 'Invite Friend', icon: 'person_add', route: '/employee/invite-friend' },
    { title: 'Hall list', icon: 'business', route: '/employee/hall/hall-list' },
    { title: 'Hall Reservations', icon: 'event_available', route: '/employee/hall-reservations' },
    { title: 'Faults', icon: 'build', route: '/employee/fault/fault-list' },
    { title: 'Equipment', icon: 'inventory_2', route: '/employee/equipment/equipment-list' },
    { title: 'Chat', icon: 'chat_bubble_outline', route: '/employee/chat' },
    { title: 'Security Questions', icon: 'security', route: '/employee/security-questions' },
    { title: 'Settings', icon: 'tune', route: '/employee/settings' }
  ];

  constructor(
    private authService: MyAuthService,
    private router: Router,
    private announcementEndpoint: AnnouncementEndpointService
  ) {console.log("Dashboard je ucitan");}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  get isOverviewRoute(): boolean {
    const url = this.router.url.split('?')[0].split('#')[0].replace(/\/$/, '');
    return url === '/employee' || url === '/employee/employee-dashboard';
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url.split('?')[0].split('#')[0].replace(/\/$/, '');
    if (route === '/employee') {
      return this.isOverviewRoute;
    }

    return currentUrl === route || currentUrl.startsWith(route + '/');
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
    return name ? this.toTitleCase(name) : 'Employee';
  }

  private loadAnnouncements(): void {
    this.loadingAnnouncements.set(true);
    this.announcementEndpoint.getAll(1, 3, ANNOUNCEMENT_AUDIENCES.EMPLOYEE).subscribe({
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

  private toTitleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

    openHallList(){
    this.router.navigate(['/employee/hall/hall-list']);
  }

  openHallAdd(){
    this.router.navigate(['/employee/hall/hall-add']);
  }

  get userRole(){
    return localStorage.getItem('role');
  }

  get userEmail(){
    return localStorage.getItem('email');
  }

  openFaultList(){
    this.router.navigate(['/employee/fault/fault-list']);
  }

  openFaultAdd(){
    this.router.navigate(['/employee/fault/fault-add']);
  }

  openEquipmentList(){
    this.router.navigate(['/employee/equipment/equipment-list']);
  }

  openEquipmentAdd(){
    this.router.navigate(['/employee/equipment/equipment-add']);
  }

    openChat(){
    this.router.navigate(['/employee/chat']);
  }
}
