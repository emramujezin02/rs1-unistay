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

interface HallReservationApiItem {
  reservationId?: string | number;
  ReservationId?: string | number;
  id?: string | number;
  Id?: string | number;
  hallId?: string | number;
  HallId?: string | number;
  hallName?: string;
  HallName?: string;
  hallCapacity?: number;
  HallCapacity?: number;
  studentId?: string | number;
  StudentId?: string | number;
  studentUsername?: string;
  StudentUsername?: string;
  studentEmail?: string;
  StudentEmail?: string;
  fromDate?: string;
  FromDate?: string;
  toDate?: string;
  ToDate?: string;
  status?: ReservationStatus;
  Status?: ReservationStatus;
  createdAt?: string;
  CreatedAt?: string;
  createdAtUtc?: string;
  CreatedAtUtc?: string;
}

interface HallReservationsApiResponse {
  items?: HallReservationApiItem[];
  Items?: HallReservationApiItem[];
  totalCount?: number;
  TotalCount?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
  totalPages?: number;
  TotalPages?: number;
}

@Injectable({ providedIn: 'root' })
export class HallReservationsEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/halls/reservations`;

  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 10, search = ''): Observable<ReservationsPagedResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<HallReservationsApiResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        let items: HallReservation[] = (response.items ?? response.Items ?? [])
          .map(item => this.mapItem(item));
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
    return this.http.get<HallReservationsApiResponse>(`${this.apiUrl}/my`).pipe(
      map(response => (response.items ?? response.Items ?? []).map(item => this.mapItem(item)))
    );
  }

  getById(id: string | number): Observable<HallReservation> {
    return this.http.get<HallReservationApiItem>(`${this.apiUrl}/${id}`).pipe(map(item => this.mapItem(item)));
  }

  create(request: CreateHallReservationRequest): Observable<HallReservation> {
    return this.http.post<HallReservationApiItem>(this.apiUrl, request).pipe(map(item => this.mapItem(item)));
  }

  updateStatus(id: string | number, status: 'Active' | 'Rejected'): Observable<HallReservation> {
    return this.http.put<HallReservationApiItem>(`${this.apiUrl}/${id}/status`, { status }).pipe(map(item => this.mapItem(item)));
  }

  cancel(id: string | number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  private mapItem(item: HallReservationApiItem): HallReservation {
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
