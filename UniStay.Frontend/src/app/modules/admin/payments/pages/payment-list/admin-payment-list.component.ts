import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminInvoice } from '../../../../../endpoints/payment-admin-endpoints/admin-payment.models';
import { PaymentsFacade } from '../../data/payments.facade';

@Component({
  selector: 'app-admin-payment-list',
  standalone: false,
  templateUrl: './admin-payment-list.component.html'
})
export class AdminPaymentListComponent implements OnInit {
  readonly displayedColumns = ['invoiceId', 'totalAmount', 'paid', 'issuedAt', 'paidAt', 'actions'];
  readonly dataSource = new MatTableDataSource<AdminInvoice>();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!sort) {
      return;
    }

    this.dataSource.sortingDataAccessor = (invoice: AdminInvoice, property: string) => {
      switch (property) {
        case 'paid':
          return invoice.paid ? 1 : 0;
        case 'issuedAt':
        case 'paidAt':
          return invoice[property] ? new Date(invoice[property] ?? '').getTime() : 0;
        default:
          return (invoice as any)[property] ?? '';
      }
    };
    this.dataSource.sort = sort;
  }

  constructor(public facade: PaymentsFacade) {
    effect(() => {
      this.dataSource.data = this.facade.invoices();
    });
  }

  ngOnInit(): void {
    this.facade.loadInvoices();
  }

  statusColor(paid: boolean): string {
    return paid ? 'primary' : 'warn';
  }

  onDownloadPdf(invoice: AdminInvoice): void {
    this.facade.downloadPdf(invoice.invoiceId);
  }
}
