import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EquipmentGetOneService {
  private url = 'http://localhost:5177/api/EquipmentGetOneEndpoint';

  constructor(private http: HttpClient) {}

  getOne(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}