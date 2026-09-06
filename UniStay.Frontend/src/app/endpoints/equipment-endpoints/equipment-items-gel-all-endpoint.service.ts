import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EquipmentItemRecord {
  recordID: number;
  equipmentID?: number;
  serialNumber?: string;
  isAvailable: boolean;
  assignedAt?: string | null;
  assignedAtUtc?: string | null;
  returnedAt?: string | null;
  returnedAtUtc?: string | null;
  location?: string | null;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class EquipmentItemsGetAllService {
  
  private url = 'http://localhost:5177/api/equipment-items';


  constructor(private http: HttpClient) {}


  getItemsByEquipment(id: number): Observable<EquipmentItemRecord[]> {
    return this.http.get<EquipmentItemRecord[]>(`${this.url}/by-equipment/${id}`);
  }


}
