import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyConfig } from '../../my-config';
import { PublicRoomDetail, PublicRoomFilters, PublicRoomsResponse } from './public-room.models';
import { normalizeRoomImageUrl } from '../room-endpoints/room.models';

@Injectable({
  providedIn: 'root'
})
export class PublicRoomEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  getAll(filters: Partial<PublicRoomFilters> = {}): Observable<PublicRoomsResponse> {
    let params = new HttpParams()
      .set('Paging.Page', filters.page ?? 1)
      .set('Paging.PageSize', filters.pageSize ?? 12);

    if (filters.floor) {
      params = params.set('floor', filters.floor);
    }

    if (filters.maxOccupancy) {
      params = params.set('maxOccupancy', filters.maxOccupancy);
    }

    if (filters.nearExit) {
      params = params.set('nearExit', true);
    }

    if (filters.wheelchairAccessible) {
      params = params.set('wheelchairAccessible', true);
    }

    if (filters.elevatorAccess) {
      params = params.set('elevatorAccess', true);
    }

    if (filters.building) {
      params = params.set('building', filters.building);
    }

    return this.http.get<PublicRoomsResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        items: (response.items ?? []).map(room => ({
          ...room,
          images: (room.images ?? []).map(normalizeRoomImageUrl)
        }))
      }))
    );
  }

  getById(id: number): Observable<PublicRoomDetail> {
    return this.http.get<PublicRoomDetail>(`${this.apiUrl}/${id}`).pipe(
      map(room => ({
        ...room,
        images: (room.images ?? []).map(normalizeRoomImageUrl),
        beds: room.beds ?? []
      }))
    );
  }
}
