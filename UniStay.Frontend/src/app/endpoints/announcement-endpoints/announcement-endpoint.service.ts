import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  AnnouncementApiDto,
  AnnouncementDto,
  CreateAnnouncementApiResult,
  CreateAnnouncementRequest,
  DeleteAnnouncementApiResult,
  DeleteAnnouncementResult,
  PagedAnnouncementsApiResult,
  PagedAnnouncementsResult
} from './announcement.models';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/announcements`;

  constructor(private http: HttpClient) {}

  getAll(
    pageNumber = 1,
    pageSize = 10,
    audiences?: string
  ): Observable<PagedAnnouncementsResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (audiences) {
      params = params.set('audiences', audiences);
    }

    return this.http.get<PagedAnnouncementsApiResult>(this.apiUrl, { params }).pipe(
      map(response => {
        const items = response.items ?? response.Items ?? [];
        const totalCount = response.totalCount ?? response.TotalCount ?? items.length;
        const normalizedPageSize = response.pageSize ?? response.PageSize ?? pageSize;

        return {
          items: items.map(item => this.mapAnnouncement(item)),
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

  create(request: CreateAnnouncementRequest): Observable<CreateAnnouncementApiResult> {
    const { expiresAt, expiresAtUtc, ...body } = request;

    return this.http.post<CreateAnnouncementApiResult>(this.apiUrl, {
      ...body,
      expiresAtUtc: expiresAtUtc ?? expiresAt ?? null
    });
  }

  delete(id: string): Observable<DeleteAnnouncementResult> {
    return this.http.delete<DeleteAnnouncementApiResult>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        announcementId: response.announcementId ?? response.AnnouncementId ?? id
      }))
    );
  }

  private mapAnnouncement(item: AnnouncementApiDto): AnnouncementDto {
    return {
      announcementId: item.announcementId ?? item.AnnouncementId ?? '',
      title: item.title ?? item.Title ?? '',
      content: item.content ?? item.Content ?? '',
      audience: item.audience ?? item.Audience ?? 'Everyone',
      createdAt: item.createdAt ?? item.CreatedAt ?? item.createdAtUtc ?? item.CreatedAtUtc ?? '',
      expiresAt: item.expiresAt ?? item.ExpiresAt ?? item.expiresAtUtc ?? item.ExpiresAtUtc ?? null,
      createdByUserId: item.createdByUserId ?? item.CreatedByUserId ?? '',
      createdByUsername: item.createdByUsername ?? item.CreatedByUsername ?? ''
    };
  }
}
