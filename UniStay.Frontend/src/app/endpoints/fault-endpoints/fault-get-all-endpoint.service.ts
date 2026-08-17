import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaultGetAllEndpointService {
  private apiUrl = 'http://localhost:5177/api/FaultGetAllEndpoint';

  constructor(private http: HttpClient) {}

  getAllFaults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}