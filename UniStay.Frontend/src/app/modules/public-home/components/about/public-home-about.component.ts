import { Component } from '@angular/core';

interface PublicHomeStat {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-public-home-about',
  standalone: false,
  templateUrl: './public-home-about.component.html',
  styleUrl: './public-home-about.component.scss'
})
export class PublicHomeAboutComponent {
  readonly stats: PublicHomeStat[] = [
    { value: '500+', label: 'Students', icon: 'people' },
    { value: '12', label: 'Halls', icon: 'apartment' },
    { value: '300+', label: 'Rooms', icon: 'bed' },
    { value: '24/7', label: 'Support', icon: 'support_agent' }
  ];
}
