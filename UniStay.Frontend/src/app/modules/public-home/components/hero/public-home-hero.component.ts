import { Component } from '@angular/core';

@Component({
  selector: 'app-public-home-hero',
  standalone: false,
  templateUrl: './public-home-hero.component.html',
  styleUrl: './public-home-hero.component.scss'
})
export class PublicHomeHeroComponent {
  scrollToFeatures(): void {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
