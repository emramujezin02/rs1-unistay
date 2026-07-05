import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EquipmentItemCreateService {

  private url = 'http://localhost:5177/api/equipment-items';

  constructor(private http: HttpClient) {}

  createItem(equipmentId:number, payload: any): Observable<any> {
    return this.http.post(`${this.url}/create/${equipmentId}`, payload);
  }
}