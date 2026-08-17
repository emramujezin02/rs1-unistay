import {ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: false,
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent {

}
