import { Injectable, signal } from '@angular/core';
import { WebhookSubscriptionDto } from './webhook.models';

@Injectable({
  providedIn: 'root'
})
export class WebhookStateService {
  private readonly subscriptionsSignal = signal<WebhookSubscriptionDto[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly subscriptions = this.subscriptionsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  setSubscriptions(subscriptions: WebhookSubscriptionDto[]): void {
    this.subscriptionsSignal.set(subscriptions);
  }

  addSubscription(subscription: WebhookSubscriptionDto): void {
    this.subscriptionsSignal.update(items => [subscription, ...items]);
  }

  removeSubscription(id: string): void {
    this.subscriptionsSignal.update(items => items.filter(item => item.id !== id));
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }
}
