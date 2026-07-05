import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminPaymentEndpointService } from '../../../../endpoints/payment-admin-endpoints/admin-payment-endpoint.service';
import { PaymentsStore } from './payments.store';

@Injectable()
export class PaymentsFacade {
  get invoices() { return this.store.invoices; }
  get loading() { return this.store.loading; }
  get error() { return this.store.error; }
  get hasInvoices() { return this.store.hasInvoices; }
  get isEmpty() { return this.store.isEmpty; }

  constructor(
    private store: PaymentsStore,
    private paymentEndpoint: AdminPaymentEndpointService,
    private translate: TranslateService
  ) {}

  loadInvoices(): void {
    this.store.setLoading(true);
    this.store.setError(null);

    this.paymentEndpoint.getAll().subscribe({
      next: invoices => {
        this.store.setInvoices(invoices);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError(this.t('ADMIN.PAYMENTS.LOAD_ERROR'));
        this.store.setLoading(false);
      }
    });
  }

  downloadPdf(invoiceId: number): void {
    this.paymentEndpoint.downloadPdf(invoiceId).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.store.setError(this.t('ADMIN.PAYMENTS.DOWNLOAD_ERROR'))
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
