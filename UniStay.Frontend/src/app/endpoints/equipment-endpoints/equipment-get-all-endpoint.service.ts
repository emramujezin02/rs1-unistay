// equipment-get-all-endpoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from './equpiment-get-by-id-endpoint.service';

export interface EquipmentFilters {
  name?: string;
  type?: string;
  minQty?: number | null;
  maxQty?: number | null;
  availableOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class EquipmentGetAllEndpointService {
  private apiUrl = 'http://localhost:5177/api/EquipmentGetAllEndpoint';
  constructor(private http: HttpClient) {}

  getAllEquipments(filters?: EquipmentFilters): Observable<Equipment[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.minQty != null) params = params.set('minQty', filters.minQty);
      if (filters.maxQty != null) params = params.set('maxQty', filters.maxQty);
      if (filters.availableOnly != null) params = params.set('availableOnly', filters.availableOnly);
    }
    return this.http.get<Equipment[]>(this.apiUrl, { params });
  }
}
