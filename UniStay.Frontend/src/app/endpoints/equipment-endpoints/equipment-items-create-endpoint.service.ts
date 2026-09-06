import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EquipmentItemCreatePayload {
  serialNumber?: string;
  isAvailable: boolean;
  assignedAt?: string | null;
  returnedAt?: string | null;
  location?: string | null;
  equipmentId: number;
}

@Injectable({ providedIn: 'root' })
export class EquipmentItemCreateService {

  private url = 'http://localhost:5177/api/equipment-items';

  constructor(private http: HttpClient) {}

  createItem(equipmentId:number, payload: EquipmentItemCreatePayload): Observable<object> {
    return this.http.post(`${this.url}/create/${equipmentId}`, payload);
  }
}
