import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hall } from './hall-get-by-id-endpoint.service';

@Injectable({ providedIn: 'root' })
export class HallGetAllEndpointService {
  private apiUrl = 'http://localhost:5177/api/HallGetAllEndpoint';

  constructor(private http: HttpClient) {}

  getAllHalls(): Observable<Hall[]> {
    return this.http.get<Hall[]>(`${this.apiUrl}`);
  }
}
