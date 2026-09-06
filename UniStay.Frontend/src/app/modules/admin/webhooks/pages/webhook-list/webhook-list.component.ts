import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { WebhookEndpointService } from '../../../../../endpoints/webhook-endpoints/webhook-endpoint.service';
import {
  WEBHOOK_EVENT_OPTIONS,
  WebhookSubscriptionDto
} from '../../../../../endpoints/webhook-endpoints/webhook.models';

@Component({
  selector: 'app-webhook-list',
  standalone: false,
  templateUrl: './webhook-list.component.html',
  styleUrl: './webhook-list.component.scss'
})
export class WebhookListComponent implements OnInit {
  readonly subscriptions = signal<WebhookSubscriptionDto[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly testingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly displayedColumns = ['url', 'description', 'events', 'createdAt', 'actions'];
  readonly availableEvents = WEBHOOK_EVENT_OPTIONS;

  form!: FormGroup;

  constructor(
    private webhookEndpoint: WebhookEndpointService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      secret: ['', [Validators.required, Validators.minLength(8)]],
      description: [''],
      events: [[], Validators.required]
    });

    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading.set(true);
    this.error.set(null);
    this.webhookEndpoint.getAll().subscribe({
      next: response => {
        this.subscriptions.set(response.subscriptions);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('ADMIN.WEBHOOKS.LOAD_ERROR');
        this.openTranslatedSnack('LOAD_ERROR', 4000);
      }
    });
  }

  toggleEvent(eventType: string): void {
    const current: string[] = this.form.value.events ?? [];
    const events = current.includes(eventType)
      ? current.filter(event => event !== eventType)
      : [...current, eventType];

    this.form.patchValue({ events });
  }

  isEventSelected(eventType: string): boolean {
    return (this.form.value.events ?? []).includes(eventType);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    const { url, secret, description, events } = this.form.value;
    this.submitting.set(true);

    this.webhookEndpoint.create({
      url,
      secret,
      description: description ?? '',
      events
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showForm.set(false);
        this.form.reset({ events: [] });
        this.loadSubscriptions();
        this.openTranslatedSnack('CREATE_SUCCESS', 3000);
      },
      error: err => {
        this.submitting.set(false);
        const message = err?.error?.detail ?? err?.error?.message ?? this.t('CREATE_ERROR');
        this.snackBar.open(message, this.t('CLOSE'), { duration: 4000 });
      }
    });
  }

  onTest(id: string): void {
    this.testingId.set(id);
    this.webhookEndpoint.test(id).subscribe({
      next: result => {
        this.testingId.set(null);
        const message = result.delivered
          ? this.t('TEST_SUCCESS')
          : this.translate.instant('ADMIN.WEBHOOKS.TEST_DELIVERY_FAILED', { error: result.error ?? this.t('UNKNOWN_ERROR') });
        this.snackBar.open(message, this.t('CLOSE'), { duration: result.delivered ? 3000 : 5000 });
      },
      error: err => {
        this.testingId.set(null);
        const message = err?.error?.detail ?? err?.error?.message ?? this.t('TEST_ERROR');
        this.snackBar.open(message, this.t('CLOSE'), { duration: 4000 });
      }
    });
  }

  onDelete(id: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: this.t('DELETE_CONFIRM') }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.deletingId.set(id);
      this.webhookEndpoint.delete(id).subscribe({
        next: result => {
          this.deletingId.set(null);
          if (result.success) {
            this.subscriptions.update(items => items.filter(item => item.id !== id));
          }
          this.openTranslatedSnack('DELETE_SUCCESS', 3000);
        },
        error: err => {
          this.deletingId.set(null);
          const message = err?.error?.detail ?? err?.error?.message ?? this.t('DELETE_ERROR');
          this.snackBar.open(message, this.t('CLOSE'), { duration: 4000 });
        }
      });
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.form.reset({ events: [] });
  }

  private openTranslatedSnack(key: string, duration: number): void {
    this.snackBar.open(this.t(key), this.t('CLOSE'), { duration });
  }

  private t(key: string): string {
    return this.translate.instant(`ADMIN.WEBHOOKS.${key}`);
  }
}
