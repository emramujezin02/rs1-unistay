export interface AdminInvoice {
  invoiceId: number;
  totalAmount: number;
  paid: boolean;
  issuedAt: string;
  paidAt?: string | null;
}

export interface AdminInvoiceApi {
  invoiceId?: number;
  invoiceID?: number;
  InvoiceId?: number;
  InvoiceID?: number;
  totalAmount?: number;
  TotalAmount?: number;
  paid?: boolean;
  Paid?: boolean;
  issuedAt?: string;
  IssuedAt?: string;
  paidAt?: string | null;
  PaidAt?: string | null;
}

export interface AdminInvoicesApiResponse {
  invoices?: AdminInvoiceApi[];
  Invoices?: AdminInvoiceApi[];
}
