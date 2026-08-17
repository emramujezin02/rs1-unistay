import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AnnouncementEndpointService } from '../../../../endpoints/announcement-endpoints/announcement-endpoint.service';
import { ANNOUNCEMENT_AUDIENCES, AnnouncementDto } from '../../../../endpoints/announcement-endpoints/announcement.models';

interface LandingFeature {
  icon: string;
  title: string;
  description: string;
}

interface LandingStat {
  icon: string;
  value: string;
  label: string;
}

const SECTION_IDS = ['announcements', 'about', 'features', 'contact'] as const;

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingPageComponent implements OnInit {
  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly activeSection = signal<string>('');
  readonly sections = SECTION_IDS;

  private readonly fallbackAnnouncements: AnnouncementDto[] = [
    {
      announcementId: 'welcome',
      title: 'Welcome to UniStay',
      content: 'Explore student accommodation, follow important updates, and keep dormitory life organized in one place.',
      audience: 'Everyone',
      createdAt: '2026-01-15',
      createdByUserId: '',
      createdByUsername: 'UniStay'
    },
    {
      announcementId: 'applications',
      title: 'Accommodation Applications',
      content: 'Sign in to submit your accommodation application and follow its status from your student dashboard.',
      audience: 'Everyone',
      createdAt: '2026-01-10',
      createdByUserId: '',
      createdByUsername: 'UniStay'
    }
  ];

  readonly announcements = signal<AnnouncementDto[]>(this.fallbackAnnouncements);
  readonly currentAnnouncementIndex = signal(0);
  readonly currentAnnouncement = computed(() => this.announcements()[this.currentAnnouncementIndex()]);
  readonly announcementDots = computed(() => this.announcements().map((_, index) => index));

  readonly stats: LandingStat[] = [
    { value: '500+', label: 'Students housed', icon: 'people' },
    { value: '12', label: 'Halls managed', icon: 'apartment' },
    { value: '300+', label: 'Rooms available', icon: 'bed' },
    { value: '24/7', label: 'Support access', icon: 'support_agent' }
  ];

  readonly features: LandingFeature[] = [
    {
      icon: 'assignment',
      title: 'Online Dorm Application',
      description: 'Apply for your dorm room online, submit documents, track status, and receive decisions in one place.'
    },
    {
      icon: 'build',
      title: 'Maintenance Requests',
      description: 'Report issues directly through the portal and track every request from submission through resolution.'
    },
    {
      icon: 'campaign',
      title: 'Community Announcements',
      description: 'Stay updated with important notices, events, and news from the dormitory administration.'
    },
    {
      icon: 'chat',
      title: 'Direct Messaging',
      description: 'Communicate directly with administration and staff through messaging built into the platform.'
    },
    {
      icon: 'receipt_long',
      title: 'Invoices and Payments',
      description: 'View your invoices, payment details, and accommodation costs from your student account.'
    },
    {
      icon: 'bed',
      title: 'Bed Assignments',
      description: 'See your assigned bed, room, and hall at a glance and keep accommodation details close.'
    }
  ];

  readonly currentYear = new Date().getFullYear();

  constructor(private announcementEndpoint: AnnouncementEndpointService) {}

  ngOnInit(): void {
    setTimeout(() => this.updateActiveSection(), 100);

    this.announcementEndpoint
      .getAll(1, 5, ANNOUNCEMENT_AUDIENCES.PUBLIC)
      .pipe(catchError(() => of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 5, totalPages: 0 })))
      .subscribe(result => {
        if (result.items.length > 0) {
          this.announcements.set(result.items);
          this.currentAnnouncementIndex.set(0);
        }
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 30);
    this.updateActiveSection();
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    this.activeSection.set(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private updateActiveSection(): void {
    let currentSection = this.activeSection() || this.sections[0];

    for (const sectionId of this.sections) {
      const element = document.getElementById(sectionId);
      if (!element) {
        continue;
      }

      if (element.getBoundingClientRect().top <= 140) {
        currentSection = sectionId;
      }
    }

    this.activeSection.set(currentSection);
  }

  nextAnnouncement(): void {
    this.currentAnnouncementIndex.update(index => (index + 1) % this.announcements().length);
  }

  previousAnnouncement(): void {
    this.currentAnnouncementIndex.update(index => (index - 1 + this.announcements().length) % this.announcements().length);
  }

  showAnnouncement(index: number): void {
    this.currentAnnouncementIndex.set(index);
  }

  formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
