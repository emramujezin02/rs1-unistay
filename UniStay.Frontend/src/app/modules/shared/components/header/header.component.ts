import {ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import { WizardService } from '../../../../services/wizard-services/wizard.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  wizardService = inject(WizardService);
  isMenuOpen = false;


  scrollToContact() {
    const target = document.getElementById('contact-section');
    if (!target) return;

    this.smoothScrollTo(target, 800); // 1500ms = 1.5 sekunde (možeš promijeniti)
  }

  smoothScrollTo(element: HTMLElement, duration: number) {
    const start = window.scrollY;
    const end = element.getBoundingClientRect().top + window.scrollY;
    const distance = end - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easing funkcija (smooth, lijepo usporavanje)
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      window.scrollTo(0, start + distance * ease);

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openSignUp() {
    this.wizardService.open();
  }
}
