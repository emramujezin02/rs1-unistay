import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export type ReservationStatus = 'Pending' | 'Active' | 'Cancelled' | 'Rejected';

export interface HallReservation {
  id: string;
  hallId: string;
  hallName: string;
  hallCapacity: number;
  studentId: string;
  studentUsername: string;
  studentEmail: string;
  fromDate: string;
  toDate: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateHallReservationRequest {
  hallId: string | number;
  fromDate: string;
  toDate: string;
}

export interface ReservationsPagedResult {
  items: HallReservation[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class HallReservationsEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/halls/reservations`;

  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 10, search = ''): Observable<ReservationsPagedResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        let items: HallReservation[] = ((response.items ?? response.Items ?? []) as any[])
          .map((item: any) => this.mapItem(item));
        if (search.trim()) {
          const term = search.trim().toLowerCase();
          items = items.filter((item: HallReservation) =>
            item.hallName.toLowerCase().includes(term) ||
            item.studentUsername.toLowerCase().includes(term) ||
            item.studentEmail.toLowerCase().includes(term) ||
            item.status.toLowerCase().includes(term));
        }

        return {
          items,
          totalCount: response.totalCount ?? response.TotalCount ?? items.length,
          pageNumber: response.pageNumber ?? response.PageNumber ?? pageNumber,
          pageSize: response.pageSize ?? response.PageSize ?? pageSize,
          totalPages: response.totalPages ?? response.TotalPages ?? Math.ceil(items.length / pageSize)
        };
      })
    );
  }

  getMyReservations(): Observable<HallReservation[]> {
    return this.http.get<any>(`${this.apiUrl}/my`).pipe(
      map(response => ((response.items ?? response.Items ?? []) as any[]).map((item: any) => this.mapItem(item)))
    );
  }

  getById(id: string | number): Observable<HallReservation> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(item => this.mapItem(item)));
  }

  create(request: CreateHallReservationRequest): Observable<HallReservation> {
    return this.http.post<any>(this.apiUrl, request).pipe(map(item => this.mapItem(item)));
  }

  updateStatus(id: string | number, status: 'Active' | 'Rejected'): Observable<HallReservation> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(map(item => this.mapItem(item)));
  }

  cancel(id: string | number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  private mapItem(item: any): HallReservation {
    return {
      id: String(item.reservationId ?? item.ReservationId ?? item.id ?? item.Id ?? ''),
      hallId: String(item.hallId ?? item.HallId ?? ''),
      hallName: item.hallName ?? item.HallName ?? '',
      hallCapacity: item.hallCapacity ?? item.HallCapacity ?? 0,
      studentId: String(item.studentId ?? item.StudentId ?? ''),
      studentUsername: item.studentUsername ?? item.StudentUsername ?? '',
      studentEmail: item.studentEmail ?? item.StudentEmail ?? '',
      fromDate: item.fromDate ?? item.FromDate ?? '',
      toDate: item.toDate ?? item.ToDate ?? '',
      status: (item.status ?? item.Status ?? 'Pending') as ReservationStatus,
      createdAt: item.createdAt ?? item.CreatedAt ?? item.createdAtUtc ?? item.CreatedAtUtc ?? ''
    };
  }
}
