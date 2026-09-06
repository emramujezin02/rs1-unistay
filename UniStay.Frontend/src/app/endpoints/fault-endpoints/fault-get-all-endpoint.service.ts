import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fault } from './fault-get-by-id-endpoint.service';

@Injectable({ providedIn: 'root' })
export class FaultGetAllEndpointService {
  private apiUrl = 'http://localhost:5177/api/FaultGetAllEndpoint';

  constructor(private http: HttpClient) {}

  getAllFaults(): Observable<Fault[]> {
    return this.http.get<Fault[]>(`${this.apiUrl}`);
  }
}
