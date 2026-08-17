import { computed, Injectable, signal } from '@angular/core';
import { AdminInvoice } from '../../../../endpoints/payment-admin-endpoints/admin-payment.models';

@Injectable()
export class PaymentsStore {
  private readonly invoicesSignal = signal<AdminInvoice[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly invoices = this.invoicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly hasInvoices = computed(() => this.invoicesSignal().length > 0);
  readonly isEmpty = computed(() => !this.loadingSignal() && this.invoicesSignal().length === 0);

  setInvoices(invoices: AdminInvoice[]): void {
    this.invoicesSignal.set(invoices);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }
}
