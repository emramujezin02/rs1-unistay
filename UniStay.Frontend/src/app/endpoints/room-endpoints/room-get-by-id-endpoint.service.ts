import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { RoomDto } from './room.models';

@Injectable({
  providedIn: 'root'
})
export class RoomGetByIdEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  getRoomById(id: number): Observable<RoomDto> {
    return this.http.get<RoomDto>(`${this.apiUrl}/${id}`);
  }
}
