import { computed, Injectable, signal } from '@angular/core';
import { ApplicationDraft, ApplicationListItem, ApplicationStatus } from './application.models';

const DRAFT_KEY = 'unistay_draft_application';

function loadDraftFromStorage(): Partial<ApplicationDraft> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) as Partial<ApplicationDraft> : {};
  } catch {
    return {};
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  private readonly applicationsSignal = signal<ApplicationListItem[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly draftSignal = signal<Partial<ApplicationDraft>>(loadDraftFromStorage());

  readonly applications = this.applicationsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly draft = this.draftSignal.asReadonly();

  readonly activeApplication = computed<ApplicationListItem | null>(() => {
    const applications = this.applicationsSignal();
    if (applications.length === 0) {
      return null;
    }

    const pending = applications.find(application => application.status === 'Pending');
    if (pending) {
      return pending;
    }

    const approved = applications.find(application => application.status === 'Approved');
    if (approved) {
      return approved;
    }

    return applications
      .filter(application => application.status === 'Rejected')
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())[0] ?? null;
  });

  readonly applicationStatus = computed<ApplicationStatus | null>(
    () => this.activeApplication()?.status ?? null
  );

  readonly canApply = computed(() => {
    const status = this.applicationStatus();
    return status === null || status === 'Rejected';
  });

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  setApplications(applications: ApplicationListItem[]): void {
    this.applicationsSignal.set(applications);
  }

  saveDraft(draft: Partial<ApplicationDraft>): void {
    this.draftSignal.set(draft);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }

  clearDraft(): void {
    this.draftSignal.set({});
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }
}
