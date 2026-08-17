export interface CreatePaymentIntentRequest {
  invoiceId: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

export interface PaymentIntentApiResponse {
  clientSecret?: string;
  ClientSecret?: string;
  amount?: number;
  Amount?: number;
}
