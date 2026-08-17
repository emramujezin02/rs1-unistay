import { Component } from '@angular/core';

interface PublicHomeFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-public-home-features',
  standalone: false,
  templateUrl: './public-home-features.component.html',
  styleUrl: './public-home-features.component.scss'
})
export class PublicHomeFeaturesComponent {
  readonly features: PublicHomeFeature[] = [
    { icon: 'assignment', title: 'Online applications', description: 'Submit housing applications and follow decisions from the student dashboard.' },
    { icon: 'bed', title: 'Room discovery', description: 'Browse public room availability before starting an application.' },
    { icon: 'build', title: 'Maintenance requests', description: 'Report room issues and keep work orders visible to the right staff.' },
    { icon: 'campaign', title: 'Announcements', description: 'Share timely housing updates with students, employees, or everyone.' },
    { icon: 'chat', title: 'Messaging', description: 'Keep communication close to accommodation workflows.' },
    { icon: 'receipt_long', title: 'Invoices', description: 'Centralize student housing invoices and payment context.' }
  ];
}
