import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class UserDeleteEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
