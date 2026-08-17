// equipment-get-by-id-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipment {
  equipmentID:number;
  name:string;
  description?:string;
  quantity:number;
  availableQuantity:number;
  rentalPrice?:string;
  equipmentType?:string;
}

@Injectable({ providedIn: 'root' })
export class EquipmentGetByIdEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentGetByIdEndpoint';
  constructor(private http: HttpClient) {}
  getEquipmentById(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }
}