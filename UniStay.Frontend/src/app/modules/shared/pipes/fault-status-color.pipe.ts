import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'faultStatusColor', standalone: false })
export class FaultStatusColorPipe implements PipeTransform {
  transform(status: string | null | undefined): string {
    switch (status) {
      case 'Resolved':
        return 'primary';
      case 'InProgress':
        return 'accent';
      case 'Closed':
        return '';
      default:
        return 'warn';
    }
  }
}
