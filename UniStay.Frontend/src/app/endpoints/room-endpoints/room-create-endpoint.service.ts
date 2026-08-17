import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { RoomCreateRequest } from './room.models';

@Injectable({
  providedIn: 'root'
})
export class RoomCreateEndpointService {

  private apiUrl = `${MyConfig.baseUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  createRoom(request: RoomCreateRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, request);
  }
}
