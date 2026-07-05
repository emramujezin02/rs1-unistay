// equipment-update-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EquipmentUpdateEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentUpdateEndpoint';
  constructor(private http: HttpClient) {}
  updateEquipment(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
}