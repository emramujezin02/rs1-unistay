import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FaultUpdateRequest {
  title:string;
  description?:string;
  status:string;
  priority:string;
  isResolved:boolean;
  resolvedAt:string;
}


@Injectable({ providedIn: 'root' })
export class FaultUpdateEndpointService {
  private apiUrl = 'http://localhost:5177/api/FaultUpdateEndpoint';
  constructor(private http: HttpClient) {}
  updateFault(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
}