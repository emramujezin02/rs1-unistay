import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hall {
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
export class HallGetByIdEndpointService {
  private apiUrl = 'http://localhost:5177/api/HallGetByIdEndpoint';

  constructor(private http: HttpClient) {}

  getHallById(id: number): Observable<Hall> {
    return this.http.get<Hall>(`${this.apiUrl}/${id}`);
  }
}