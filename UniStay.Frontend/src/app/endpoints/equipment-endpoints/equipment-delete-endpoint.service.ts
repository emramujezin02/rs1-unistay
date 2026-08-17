// equipment-delete-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EquipmentDeleteEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentDeleteEndpoint';
  constructor(private http: HttpClient) {}
  deleteEquipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}