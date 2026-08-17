import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  CreatePaymentIntentRequest,
  PaymentIntentApiResponse,
  PaymentIntentResponse
} from './payment.models';

@Injectable({
  providedIn: 'root'
})
export class CreatePaymentIntentEndpointService {

  private readonly apiUrl = `${MyConfig.baseUrl}/api/payments/create-intent`;

  constructor(private http: HttpClient) {}

  createPaymentIntent(invoiceId: number): Observable<PaymentIntentResponse> {
    const request: CreatePaymentIntentRequest = { invoiceId };

    return this.http.post<PaymentIntentApiResponse>(this.apiUrl, request).pipe(
      map(response => ({
        clientSecret: response.clientSecret ?? response.ClientSecret ?? '',
        amount: response.amount ?? response.Amount ?? 0
      }))
    );
  }
}
