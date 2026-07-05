import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { RoomUpdateRequest } from './room.models';

@Injectable({
  providedIn: 'root'
})
export class RoomUpdateEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  updateRoom(id: number, request: RoomUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }
}
