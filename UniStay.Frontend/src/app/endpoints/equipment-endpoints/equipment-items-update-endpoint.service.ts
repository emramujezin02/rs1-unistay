import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EquipmentItemsUpdateService {
  
  private url = 'http://localhost:5177/api/equipment-records';
  private urls='http://localhost:5177/api/equipment-items';

  constructor(private http: HttpClient) {}

  getRecord(id: number): Observable<any> {
    return this.http.get(`${this.url}/get/${id}`);
  }

  updateAvailability(id: number, isAvailable: boolean) {
    return this.http.put(`${this.url}/${id}/availability?isAvailable=${isAvailable}`, {});
  }

    updateItem(id:number,payload:any):Observable<any>{
    return this.http.put(`${this.url}/update/${id}`,payload);
  }

assignItem(payload:any) {
  return this.http.post(`${this.url}/assign`, payload);
}

releaseItem(id:number) {
  return this.http.post(`${this.url}/release/${id}`, {});
}

deleteRecord(id:number) {
  return this.http.delete(`${this.urls}/delete/${id}`);
}
}
