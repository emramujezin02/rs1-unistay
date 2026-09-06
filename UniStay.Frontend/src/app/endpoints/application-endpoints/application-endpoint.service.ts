import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  AdminApplicationApiItem,
  AdminApplicationListItem,
  ApplicationApiItem,
  ApplicationDetails,
  ApplicationDetailsApiResult,
  ApplicationListItem,
  ApproveApplicationApiResponse,
  ApproveApplicationResponse,
  CreateApplicationApiResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetAllApplicationsApiResponse,
  GetAllApplicationsResponse,
  GetMyApplicationsApiResponse,
  GetMyApplicationsResponse,
  MinGpaApiResponse,
  MinGpaResponse,
  RejectApplicationApiResponse,
  RejectApplicationResponse
} from './application.models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/applications`;

  constructor(private http: HttpClient) {}

  getMinimumGpa(): Observable<MinGpaResponse> {
    return this.http.get<MinGpaApiResponse>(`${this.apiUrl}/min-gpa`).pipe(
      map(response => ({
        minimumGpa: response.minimumGpa ?? response.MinimumGpa ?? 0
      }))
    );
  }

  getMy(): Observable<GetMyApplicationsResponse> {
    return this.http.get<GetMyApplicationsApiResponse>(`${this.apiUrl}/my`).pipe(
      map(response => ({
        items: (response.items ?? response.Items ?? []).map(item => this.mapApplication(item))
      }))
    );
  }

  create(request: CreateApplicationRequest): Observable<CreateApplicationResponse> {
    return this.http.post<CreateApplicationApiResponse>(this.apiUrl, request).pipe(
      map(response => ({
        applicationId: response.applicationId ?? response.ApplicationId ?? ''
      }))
    );
  }

  getAll(
    pageNumber = 1,
    pageSize = 10,
    searchTerm = '',
    status = ''
  ): Observable<GetAllApplicationsResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<GetAllApplicationsApiResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        const items = response.items ?? response.Items ?? [];
        const totalCount = response.totalCount ?? response.TotalCount ?? items.length;
        const normalizedPageSize = response.pageSize ?? response.PageSize ?? pageSize;

        return {
          items: items.map(item => this.mapAdminApplication(item)),
          totalCount,
          pageNumber: response.pageNumber ?? response.PageNumber ?? pageNumber,
          pageSize: normalizedPageSize,
          totalPages: response.totalPages ??
            response.TotalPages ??
            Math.ceil(totalCount / normalizedPageSize)
        };
      })
    );
  }

  getById(id: string): Observable<ApplicationDetails> {
    return this.http.get<ApplicationDetailsApiResult>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        applicationId: response.applicationId ?? response.ApplicationId ?? '',
        studentId: response.studentId ?? response.StudentId ?? '',
        studentUsername: response.studentUsername ?? response.StudentUsername ?? '',
        studentEmail: response.studentEmail ?? response.StudentEmail ?? '',
        studentFirstName: response.studentFirstName ?? response.StudentFirstName ?? '',
        studentLastName: response.studentLastName ?? response.StudentLastName ?? '',
        preferredRoomType: response.preferredRoomType ?? response.PreferredRoomType ?? '',
        notes: response.notes ?? response.Notes ?? null,
        status: response.status ?? response.Status ?? 'Pending',
        appliedAt: response.appliedAt ?? response.AppliedAt ?? response.appliedAtUtc ?? response.AppliedAtUtc ?? '',
        decisionAt: response.decisionAt ?? response.DecisionAt ?? response.decisionAtUtc ?? response.DecisionAtUtc ?? null,
        assignedRoomId: response.assignedRoomId ?? response.AssignedRoomId ?? null,
        assignedRoomNumber: response.assignedRoomNumber ?? response.AssignedRoomNumber ?? null,
        decisionByUserId: response.decisionByUserId ?? response.DecisionByUserId ?? null
      }))
    );
  }

  approve(id: string, bedId: string): Observable<ApproveApplicationResponse> {
    return this.http.post<ApproveApplicationApiResponse>(`${this.apiUrl}/${id}/approve`, { bedId }).pipe(
      map(response => ({
        applicationId: response.applicationId ?? response.ApplicationId ?? id,
        bedAssignmentId: response.bedAssignmentId ?? response.BedAssignmentId ?? ''
      }))
    );
  }

  reject(id: string): Observable<RejectApplicationResponse> {
    return this.http.post<RejectApplicationApiResponse>(`${this.apiUrl}/${id}/reject`, {}).pipe(
      map(response => ({
        applicationId: response.applicationId ?? response.ApplicationId ?? id
      }))
    );
  }

  downloadDocument(applicationId: string, fileId: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${encodeURIComponent(applicationId)}/documents/${encodeURIComponent(fileId)}`,
      { responseType: 'blob' }
    );
  }

  private mapApplication(item: ApplicationApiItem): ApplicationListItem {
    return {
      applicationId: item.applicationId ?? item.ApplicationId ?? '',
      preferredRoomType: item.preferredRoomType ?? item.PreferredRoomType ?? '',
      preferredRoomId: item.preferredRoomId ?? item.PreferredRoomId ?? null,
      yearOfStudy: item.yearOfStudy ?? item.YearOfStudy ?? 0,
      gpaScore: item.gpaScore ?? item.GpaScore ?? null,
      phoneNumber: item.phoneNumber ?? item.PhoneNumber ?? null,
      specialRequirements: item.specialRequirements ?? item.SpecialRequirements ?? null,
      documentNames: item.documentNames ?? item.DocumentNames ?? null,
      notes: item.notes ?? item.Notes ?? null,
      status: item.status ?? item.Status ?? 'Pending',
      appliedAt: item.appliedAt ?? item.AppliedAt ?? item.appliedAtUtc ?? item.AppliedAtUtc ?? '',
      decisionAt: item.decisionAt ?? item.DecisionAt ?? item.decisionAtUtc ?? item.DecisionAtUtc ?? null,
      assignedRoomId: item.assignedRoomId ?? item.AssignedRoomId ?? null
    };
  }

  private mapAdminApplication(item: AdminApplicationApiItem): AdminApplicationListItem {
    return {
      ...this.mapApplication(item),
      studentId: item.studentId ?? item.StudentId ?? '',
      studentUsername: item.studentUsername ?? item.StudentUsername ?? '',
      studentEmail: item.studentEmail ?? item.StudentEmail ?? '',
      decisionByUserId: item.decisionByUserId ?? item.DecisionByUserId ?? null
    };
  }
}
