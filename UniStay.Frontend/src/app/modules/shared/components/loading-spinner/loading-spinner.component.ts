import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner-container">
      <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
  `]
})
export class LoadingSpinnerComponent {}
