import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'faultPriorityColor', standalone: false })
export class FaultPriorityColorPipe implements PipeTransform {
  transform(priority: string | null | undefined): string {
    switch (priority) {
      case 'Critical':
      case 'High':
        return 'warn';
      case 'Medium':
        return 'accent';
      default:
        return '';
    }
  }
}
