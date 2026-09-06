import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentItemRecord } from './equipment-items-gel-all-endpoint.service';

export interface EquipmentItemUpdatePayload {
  serialNumber?: string;
  isAvailable: boolean;
  assignedAt?: string | null;
  returnedAt?: string | null;
  location?: string | null;
}

export interface EquipmentItemAssignPayload {
  equipmentRecordID: number;
  assignedAt: string | null;
  returnedAt: string | null;
  location: string | null;
}


@Injectable({ providedIn: 'root' })
export class EquipmentItemsUpdateService {
  
  private url = 'http://localhost:5177/api/equipment-records';
  private urls='http://localhost:5177/api/equipment-items';

  constructor(private http: HttpClient) {}

  getRecord(id: number): Observable<EquipmentItemRecord> {
    return this.http.get<EquipmentItemRecord>(`${this.url}/get/${id}`);
  }

  updateAvailability(id: number, isAvailable: boolean) {
    return this.http.put(`${this.url}/${id}/availability?isAvailable=${isAvailable}`, {});
  }

    updateItem(id:number,payload: EquipmentItemUpdatePayload):Observable<object>{
    return this.http.put(`${this.url}/update/${id}`,payload);
  }

assignItem(payload: EquipmentItemAssignPayload): Observable<object> {
  return this.http.post(`${this.url}/assign`, payload);
}

releaseItem(id:number) {
  return this.http.post(`${this.url}/release/${id}`, {});
}

deleteRecord(id:number) {
  return this.http.delete(`${this.urls}/delete/${id}`);
}
}
