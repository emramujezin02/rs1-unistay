import { Component, OnInit, signal } from '@angular/core';
import { prepareRoute, routeTransition } from '../../../shared/animations/route-animations';
import { Router } from '@angular/router';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';
import { AnnouncementEndpointService } from '../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../endpoints/announcement-endpoints/announcement.models';

interface DashboardAction {
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'teal' | 'red';
  route: string;
}

interface DashboardNavItem {
  titleKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone:false,
  animations: [routeTransition]
})
export class EmployeeDashboardComponent implements OnInit {
  readonly prepareRoute = prepareRoute;
  readonly announcements = signal<AnnouncementDto[]>([]);
  readonly loadingAnnouncements = signal(false);

  readonly primaryActions: DashboardAction[] = [
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.ROOM_MANAGEMENT_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.ROOM_MANAGEMENT_DESC',
      icon: 'meeting_room',
      color: 'teal',
      route: '/employee/rooms'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.STUDENT_RECORDS_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.STUDENT_RECORDS_DESC',
      icon: 'group',
      color: 'green',
      route: '/employee/students'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.HALL_LIST_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.HALL_LIST_DESC',
      icon: 'business',
      color: 'blue',
      route: '/employee/hall/hall-list'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.HALL_RESERVATIONS_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.HALL_RESERVATIONS_DESC',
      icon: 'event_available',
      color: 'teal',
      route: '/employee/hall-reservations'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.INVITE_FRIEND_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.INVITE_FRIEND_DESC',
      icon: 'person_add',
      color: 'blue',
      route: '/employee/invite-friend'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.FAULT_LIST_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.FAULT_LIST_DESC',
      icon: 'build',
      color: 'amber',
      route: '/employee/fault/fault-list'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.EQUIPMENT_LIST_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.EQUIPMENT_LIST_DESC',
      icon: 'inventory_2',
      color: 'green',
      route: '/employee/equipment/equipment-list'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.CHAT_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.CHAT_DESC',
      icon: 'chat_bubble_outline',
      color: 'purple',
      route: '/employee/chat'
    },
    {
      titleKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.SECURITY_QUESTIONS_TITLE',
      descriptionKey: 'EMPLOYEE.DASHBOARD_HOME.CARDS.SECURITY_QUESTIONS_DESC',
      icon: 'security',
      color: 'red',
      route: '/employee/security-questions'
    }
  ];

  readonly panelNavItems: DashboardNavItem[] = [
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.DASHBOARD', icon: 'dashboard', route: '/employee' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.ROOM_MANAGEMENT', icon: 'meeting_room', route: '/employee/rooms' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.STUDENT_RECORDS', icon: 'group', route: '/employee/students' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.INVITE_FRIEND', icon: 'person_add', route: '/employee/invite-friend' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.HALL_LIST', icon: 'business', route: '/employee/hall/hall-list' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.HALL_RESERVATIONS', icon: 'event_available', route: '/employee/hall-reservations' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.FAULTS', icon: 'build', route: '/employee/fault/fault-list' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.EQUIPMENT', icon: 'inventory_2', route: '/employee/equipment/equipment-list' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.CHAT', icon: 'chat_bubble_outline', route: '/employee/chat' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.SECURITY_QUESTIONS', icon: 'security', route: '/employee/security-questions' },
    { titleKey: 'EMPLOYEE.DASHBOARD_HOME.NAV.SETTINGS', icon: 'tune', route: '/employee/settings' }
  ];

  constructor(
    private authService: MyAuthService,
    private router: Router,
    private announcementEndpoint: AnnouncementEndpointService
  ) {}

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

  get greetingKey(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'EMPLOYEE.DASHBOARD_HOME.GREETING.MORNING';
    }
    if (hour < 18) {
      return 'EMPLOYEE.DASHBOARD_HOME.GREETING.AFTERNOON';
    }
    return 'EMPLOYEE.DASHBOARD_HOME.GREETING.EVENING';
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

