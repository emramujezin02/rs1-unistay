import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HallGetAllEndpointService {
  private apiUrl = 'http://localhost:5177/api/HallGetAllEndpoint';

  constructor(private http: HttpClient) {}

  getAllHalls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}