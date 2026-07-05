import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HallCreateRequest {
  name: string;
  capacity: number;
  description: string;
  availableFrom: string;
  availableTo: string;
  isAvailable: boolean;
}

export interface HallResponse {
  hallID: number;
  name: string;
  capacity: number;
  description: string;
  availableFrom: string;
  availableTo: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HallCreateEndpointService {
  private apiUrl = 'http://localhost:5177/api/HallCreateEndpoint'; 

  constructor(private http: HttpClient) {}

  createHall(request: HallCreateRequest): Observable<HallResponse> {
    return this.http.post<HallResponse>(`${this.apiUrl}`, request);
  }
}