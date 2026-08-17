import { Injectable } from '@angular/core';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { WebhookEndpointService } from './webhook-endpoint.service';
import {
  CreateWebhookRequest,
  CreateWebhookResponse,
  DeleteWebhookResponse,
  GetWebhookSubscriptionsResponse,
  TestWebhookResponse
} from './webhook.models';
import { WebhookStateService } from './webhook-state.service';

@Injectable({
  providedIn: 'root'
})
export class WebhookFacadeService {
  readonly subscriptions = this.state.subscriptions;
  readonly loading = this.state.loading;
  readonly error = this.state.error;

  constructor(
    private api: WebhookEndpointService,
    private state: WebhookStateService
  ) {}

  loadSubscriptions(): Observable<GetWebhookSubscriptionsResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.getAll().pipe(
      tap({
        next: response => this.state.setSubscriptions(response.subscriptions),
        error: () => this.state.setError('Failed to load webhook subscriptions.')
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  createSubscription(request: CreateWebhookRequest): Observable<GetWebhookSubscriptionsResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.create(request).pipe(
      switchMap(() => this.api.getAll()),
      tap({
        next: response => this.state.setSubscriptions(response.subscriptions),
        error: () => this.state.setError('Failed to create webhook subscription.')
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  deleteSubscription(id: string): Observable<DeleteWebhookResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.delete(id).pipe(
      tap({
        next: response => {
          if (response.success) {
            this.state.removeSubscription(id);
          }
        },
        error: () => this.state.setError('Failed to delete webhook subscription.')
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  testSubscription(id: string): Observable<TestWebhookResponse> {
    return this.api.test(id);
  }
}
