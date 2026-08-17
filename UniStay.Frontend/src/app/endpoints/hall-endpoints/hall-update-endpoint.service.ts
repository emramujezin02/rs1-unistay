import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HallUpdateRequest {
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
export class HallUpdateEndpointService {
  private apiUrl = 'http://localhost:5177/api/HallUpdateEndpoint';

  constructor(private http: HttpClient) {}

  updateHall(id:number,hall:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, hall);
  }
}