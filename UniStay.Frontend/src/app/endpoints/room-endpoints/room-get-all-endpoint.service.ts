import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { PageResult, RoomDto, RoomListFilters } from './room.models';

@Injectable({
  providedIn: 'root'
})
export class RoomGetAllEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  getAllRooms(filters: RoomListFilters = {}, pageNumber = 1, pageSize = 10): Observable<PageResult<RoomDto>> {
    let params = new HttpParams()
      .set('Paging.Page', pageNumber)
      .set('Paging.PageSize', pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.http.get<PageResult<RoomDto>>(this.apiUrl, { params });
  }
}
