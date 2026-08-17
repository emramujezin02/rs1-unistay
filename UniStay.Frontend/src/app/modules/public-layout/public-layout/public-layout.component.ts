import { Component } from '@angular/core';
import { prepareRoute, routeTransition } from '../../../shared/animations/route-animations';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
  animations: [routeTransition]
})
export class PublicLayoutComponent {
  readonly prepareRoute = prepareRoute;
  readonly currentYear = new Date().getFullYear();
}


