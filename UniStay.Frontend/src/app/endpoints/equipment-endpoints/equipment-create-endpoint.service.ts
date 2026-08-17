// equipment-create-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EquipmentCreateRequest {
  name: string;
  description?: string;
  quantity: number;
  availableQuantity: number;
  rentalPrice?: string;
  equipmentType?: string;
}

export interface EquipmentResponse {
  equipmentID: number;
  name: string;
  description?: string;
  quantity: number;
  availableQuantity: number;
  rentalPrice?: string;
  equipmentType?: string;
}

@Injectable({ providedIn: 'root' })
export class EquipmentCreateEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentCreateEndpoint';
  constructor(private http: HttpClient) {}
  createEquipment(payload: EquipmentCreateRequest): Observable<EquipmentResponse> {
    return this.http.post<EquipmentResponse>(this.apiUrl, payload);
  }
}