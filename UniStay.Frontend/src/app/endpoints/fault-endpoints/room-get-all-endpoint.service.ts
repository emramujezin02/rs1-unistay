import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { mapRoomDtoToViewModel, PageResult, RoomDto, RoomViewModel } from '../room-endpoints/room.models';

@Injectable({ providedIn: 'root' })
export class RoomGetAllEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<RoomViewModel[]> {
    const params = new HttpParams()
      .set('Paging.Page', 1)
      .set('Paging.PageSize', 10000);

    return this.http.get<PageResult<RoomDto>>(this.apiUrl, { params })
      .pipe(map(result => (result.items ?? []).map(mapRoomDtoToViewModel)));
  }
}
