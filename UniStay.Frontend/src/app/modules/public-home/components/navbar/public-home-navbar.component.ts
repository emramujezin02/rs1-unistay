import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WizardService } from '../../../../services/wizard-services/wizard.service';
import { PublicHomeActiveSectionService } from '../../services/public-home-active-section.service';
import { PublicHomeSmoothScrollService } from '../../services/public-home-smooth-scroll.service';

const SECTION_IDS = ['hero', 'announcements', 'about', 'features', 'contact'] as const;

@Component({
  selector: 'app-public-home-navbar',
  standalone: false,
  templateUrl: './public-home-navbar.component.html',
  styleUrl: './public-home-navbar.component.scss',
  providers: [PublicHomeActiveSectionService, PublicHomeSmoothScrollService]
})
export class PublicHomeNavbarComponent implements OnInit, OnDestroy {
  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly sections = SECTION_IDS;

  constructor(
    private activeSectionService: PublicHomeActiveSectionService,
    private smoothScroll: PublicHomeSmoothScrollService,
    private wizardService: WizardService,
    private router: Router
  ) {}

  get activeSection() {
    return this.activeSectionService.activeSection;
  }

  ngOnInit(): void {
    setTimeout(() => this.activeSectionService.observe(SECTION_IDS), 100);
  }

  ngOnDestroy(): void {
    this.activeSectionService.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 30);
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    this.smoothScroll.scrollTo(sectionId);
  }

  openSignUp(): void {
    this.closeMenu();
    this.wizardService.open();
  }

  goToLogin(): void {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
