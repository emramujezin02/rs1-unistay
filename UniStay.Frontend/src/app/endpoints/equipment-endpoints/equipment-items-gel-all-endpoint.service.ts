import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EquipmentItemsGetAllService {
  
  private url = 'http://localhost:5177/api/equipment-items';


  constructor(private http: HttpClient) {}


  getItemsByEquipment(id: number) {
    return this.http.get<any[]>(`${this.url}/by-equipment/${id}`);
  }


}