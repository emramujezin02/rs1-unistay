import { Injectable, signal } from '@angular/core';

@Injectable()
export class PublicHomeActiveSectionService {
  readonly activeSection = signal<string>('hero');
  private observer?: IntersectionObserver;

  observe(sectionIds: readonly string[]): void {
    this.disconnect();

    this.observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target.id) {
        this.activeSection.set(visible.target.id);
      }
    }, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: [0.15, 0.35, 0.6]
    });

    sectionIds
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => !!element)
      .forEach(element => this.observer?.observe(element));
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
