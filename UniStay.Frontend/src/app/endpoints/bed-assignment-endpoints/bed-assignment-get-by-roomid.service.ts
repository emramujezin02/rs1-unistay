import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class BedAssignGetByRoomService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments/room`;

  constructor(private http: HttpClient) {}

  getByRoom(roomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${roomId}`);
  }
}
