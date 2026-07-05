import { inject, Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { ApplicationEndpointService } from './application-endpoint.service';
import {
  ApplicationDraft,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetMyApplicationsResponse
} from './application.models';
import { ApplicationStateService } from './application-state.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationFacadeService {
  private readonly api = inject(ApplicationEndpointService);
  private readonly state = inject(ApplicationStateService);

  readonly applications = this.state.applications;
  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly draft = this.state.draft;
  readonly activeApplication = this.state.activeApplication;
  readonly applicationStatus = this.state.applicationStatus;
  readonly canApply = this.state.canApply;

  loadMyApplications(): Observable<GetMyApplicationsResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.getMy().pipe(
      tap({
        next: result => this.state.setApplications(result.items),
        error: () => this.state.setError('Failed to load application status.')
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  submitApplication(request: CreateApplicationRequest): Observable<CreateApplicationResponse> {
    this.state.setLoading(true);
    this.state.setError(null);

    return this.api.create(request).pipe(
      tap({
        next: () => this.state.clearDraft(),
        error: () => this.state.setError('Failed to submit application.')
      }),
      finalize(() => this.state.setLoading(false))
    );
  }

  saveDraft(draft: Partial<ApplicationDraft>): void {
    this.state.saveDraft(draft);
  }

  clearDraft(): void {
    this.state.clearDraft();
  }
}
