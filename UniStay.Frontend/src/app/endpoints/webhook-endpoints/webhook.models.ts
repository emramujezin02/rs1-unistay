export interface WebhookSubscriptionDto {
  id: string;
  url: string;
  description: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreateWebhookRequest {
  url: string;
  secret: string;
  events: string[];
  description: string;
}

export interface CreateWebhookResponse {
  subscriptionId: string;
}

export interface DeleteWebhookResponse {
  success: boolean;
}

export interface TestWebhookResponse {
  delivered: boolean;
  error: string | null;
}

export interface GetWebhookSubscriptionsResponse {
  subscriptions: WebhookSubscriptionDto[];
}

export interface WebhookSubscriptionApiDto {
  id?: string;
  Id?: string;
  url?: string;
  Url?: string;
  description?: string;
  Description?: string;
  events?: string[];
  Events?: string[];
  isActive?: boolean;
  IsActive?: boolean;
  createdAt?: string;
  CreatedAt?: string;
}

export interface GetWebhookSubscriptionsApiResponse {
  subscriptions?: WebhookSubscriptionApiDto[];
  Subscriptions?: WebhookSubscriptionApiDto[];
}

export interface CreateWebhookApiResponse {
  subscriptionId?: string;
  SubscriptionId?: string;
}

export interface DeleteWebhookApiResponse {
  success?: boolean;
  Success?: boolean;
}

export interface TestWebhookApiResponse {
  delivered?: boolean;
  Delivered?: boolean;
  error?: string | null;
  Error?: string | null;
}

export const WEBHOOK_EVENT_OPTIONS = [
  'announcement.published',
  'application.submitted',
  'application.approved',
  'application.rejected',
  'payment.succeeded',
  'webhook.test'
] as const;
