import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface FavoriteRoomDto {
  roomId?: number;
  roomID?: number;
  id?: number;
  roomNumber: string;
  floor?: number;
  maxOccupancy?: number;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/favorites`;

  constructor(private http: HttpClient) {}

  add(roomId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/add?roomId=${roomId}`, {}
    );
  }

  remove(roomId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/remove?roomId=${roomId}`
    );
  }

  getMy(): Observable<FavoriteRoomDto[]> {
    return this.http.get<FavoriteRoomDto[]>(
      `${this.apiUrl}/my`
    );
  }

}
