import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fault {
  faultID:number;
  title:string;
  description:string;
  isResolved:boolean;
  reportedAt:string;
  resolvedAt?:string;
  priority?:string;
  reportedByUserID:number;
  roomID:number;
  status:string;
}

@Injectable({ providedIn: 'root' })
export class FaultGetByIdEndpointService {
  private apiUrl = 'http://localhost:5177/api/faults';
  constructor(private http: HttpClient) {}
  getFaultById(id: number): Observable<Fault> {
    return this.http.get<Fault>(`${this.apiUrl}/${id}`);
  }
}