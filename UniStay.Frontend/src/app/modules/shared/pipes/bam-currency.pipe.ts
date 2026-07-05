import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bamCurrency', standalone: false })
export class BamCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) {
      return '—';
    }

    return `${value.toFixed(2)} BAM`;
  }
}
