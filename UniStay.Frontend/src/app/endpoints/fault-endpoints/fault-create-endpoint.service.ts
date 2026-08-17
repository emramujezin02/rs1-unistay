import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface FaultCreateRequest {
  title:string;
  reportedBy:number;
  description?:string;
  roomID:number;
}

export interface FaultResponse {
  faultID:number;
  title:string;
  reportedBy:number;
  description?:string;
  roomID:number;
}

@Injectable({ providedIn: 'root' })
export class FaultCreateEndpointService {
  private apiUrl = 'http://localhost:5177/api/FaultCreateEndpoint';
  constructor(private http: HttpClient) {}
  createFault(payload: FaultCreateRequest): Observable<FaultResponse> {
    return this.http.post<FaultResponse>(`${this.apiUrl}`, payload);
  }
}