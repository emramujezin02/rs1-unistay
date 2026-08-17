import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  CreateWebhookApiResponse,
  CreateWebhookRequest,
  CreateWebhookResponse,
  DeleteWebhookApiResponse,
  DeleteWebhookResponse,
  GetWebhookSubscriptionsApiResponse,
  GetWebhookSubscriptionsResponse,
  TestWebhookApiResponse,
  TestWebhookResponse,
  WebhookSubscriptionApiDto,
  WebhookSubscriptionDto
} from './webhook.models';

@Injectable({
  providedIn: 'root'
})
export class WebhookEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/webhooks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GetWebhookSubscriptionsResponse> {
    return this.http.get<GetWebhookSubscriptionsApiResponse>(this.apiUrl).pipe(
      map(response => ({
        subscriptions: (response.subscriptions ?? response.Subscriptions ?? [])
          .map(item => this.mapSubscription(item))
      }))
    );
  }

  create(request: CreateWebhookRequest): Observable<CreateWebhookResponse> {
    return this.http.post<CreateWebhookApiResponse>(this.apiUrl, request).pipe(
      map(response => ({
        subscriptionId: response.subscriptionId ?? response.SubscriptionId ?? ''
      }))
    );
  }

  delete(id: string): Observable<DeleteWebhookResponse> {
    return this.http.delete<DeleteWebhookApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        success: response.success ?? response.Success ?? false
      }))
    );
  }

  test(id: string): Observable<TestWebhookResponse> {
    return this.http.post<TestWebhookApiResponse>(`${this.apiUrl}/${id}/test`, {}).pipe(
      map(response => ({
        delivered: response.delivered ?? response.Delivered ?? false,
        error: response.error ?? response.Error ?? null
      }))
    );
  }

  private mapSubscription(item: WebhookSubscriptionApiDto): WebhookSubscriptionDto {
    return {
      id: item.id ?? item.Id ?? '',
      url: item.url ?? item.Url ?? '',
      description: item.description ?? item.Description ?? '',
      events: item.events ?? item.Events ?? [],
      isActive: item.isActive ?? item.IsActive ?? false,
      createdAt: item.createdAt ?? item.CreatedAt ?? ''
    };
  }
}
