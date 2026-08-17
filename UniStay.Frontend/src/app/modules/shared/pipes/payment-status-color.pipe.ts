import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paymentStatusColor', standalone: false })
export class PaymentStatusColorPipe implements PipeTransform {
  transform(paid: boolean | null | undefined): string {
    return paid ? 'primary' : 'warn';
  }
}
