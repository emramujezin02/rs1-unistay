import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appStatusColor', standalone: false })
export class AppStatusColorPipe implements PipeTransform {
  transform(status: string | null | undefined): string {
    switch (status) {
      case 'Approved':
      case 'Active':
        return 'primary';
      case 'Rejected':
        return 'warn';
      case 'Cancelled':
        return '';
      default:
        return 'accent';
    }
  }
}
