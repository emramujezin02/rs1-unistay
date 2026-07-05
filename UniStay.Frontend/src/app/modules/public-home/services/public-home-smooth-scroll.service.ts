import { Injectable } from '@angular/core';

@Injectable()
export class PublicHomeSmoothScrollService {
  scrollTo(sectionId: string): void {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
