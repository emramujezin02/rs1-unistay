import {Component, OnInit, signal, ViewChild, ElementRef} from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { GetInvoicesByUserIdEndpointService, Invoice} from '../../../../endpoints/invoice-enpoints/get-invoices-by-userid.service';
import { GetInvoicePdfEndpointService} from '../../../../endpoints/invoice-enpoints/get-invoice-pdf-endpoint.service';
import { CreatePaymentIntentEndpointService} from '../../../../endpoints/stripe-endpoints/create-payment-intent-endpoint.service';

const STRIPE_PUBLIC_KEY = 'pk_test_51Sh8EFHluAfQYHBx0Wty6mNnc6ZP50UAXG7MUtoG539oEzBFnfQA25kYKxt39IvMcsrYKh48OZVdjXJFyIQhUTKt00tnoPsA96';


@Component({
  selector: 'app-invoices',
  standalone: false,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {

  readonly invoices = signal<Invoice[]>([]);
  @ViewChild('cardElement') cardElement!: ElementRef<HTMLDivElement>;
  stripe!: Stripe;
  card!: StripeCardElement;
  clientSecret = '';

  showPayment = false;
  private currentUserId: number | null = null;

  constructor(
    private getInvoicesByUserIdEndpoint: GetInvoicesByUserIdEndpointService,
    private createPaymentIntentEndpointService: CreatePaymentIntentEndpointService,
    private getInvoicePdfService: GetInvoicePdfEndpointService
  ) {}

  ngOnInit(): void {
    this.currentUserId = Number(localStorage.getItem('id'));

    if (!this.currentUserId) {
      console.error('Student ID not found in localStorage');
      return;
    }

    this.loadInvoices();
  }

  private loadInvoices(): void {
    if (!this.currentUserId) {
      return;
    }

    this.getInvoicesByUserIdEndpoint
      .getByUserId(this.currentUserId)
      .subscribe({
        next: (data:Invoice[]) => this.invoices.set(data),
        error: (err:any) => console.error('Error loading invoices', err)
      });
  }

  downloadInvoice(invoiceId: number) {
    this.getInvoicePdfService
      .downloadInvoicePdf(invoiceId)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      });
  }

  payInvoice(invoiceId: number): void {
    console.log('Pay invoice:', invoiceId);
    this.createPaymentIntentEndpointService.createPaymentIntent(invoiceId).subscribe({
      next: async res => {
        this.clientSecret = res.clientSecret;

        this.showPayment = true;

        setTimeout(() => {
          this.openStripeForm();
        }, 0);
      },
      error: err => console.error(err)
    });
  }

  async openStripeForm() {
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

    if (!stripe || !this.cardElement) {
      console.error('Stripe form could not be initialized');
      return;
    }

    this.stripe = stripe;

    const elements = this.stripe.elements();
    this.card = elements.create('card');

    this.card.mount(this.cardElement.nativeElement);
  }


  async confirmPayment() {
    if (!this.stripe || !this.card || !this.clientSecret) {
      console.error('Stripe payment form is not ready');
      return;
    }

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card
      }
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('Payment successful!');

      this.closePayment();
      this.loadInvoices();
    }
  }
  closePayment() {
    this.showPayment = false;

    if (this.card) {
      this.card.unmount();
    }
  }

  getStatusClass(paid: boolean): string {
    return paid ? 'paid' : 'unpaid';
  }

}
