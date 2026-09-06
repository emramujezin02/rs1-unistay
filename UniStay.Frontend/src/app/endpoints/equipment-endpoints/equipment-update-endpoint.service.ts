// equipment-update-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipmentCreateRequest } from './equipment-create-endpoint.service';

@Injectable({ providedIn: 'root' })
export class EquipmentUpdateEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentUpdateEndpoint';
  constructor(private http: HttpClient) {}
  updateEquipment(id: number, payload: EquipmentCreateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }
}
