import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentItemRecord } from './equipment-items-gel-all-endpoint.service';


@Injectable({ providedIn: 'root' })
export class EquipmentGetOneService {
  private url = 'http://localhost:5177/api/EquipmentGetOneEndpoint';

  constructor(private http: HttpClient) {}

  getOne(id: number): Observable<EquipmentItemRecord> {
    return this.http.get<EquipmentItemRecord>(`${this.url}/${id}`);
  }
}
