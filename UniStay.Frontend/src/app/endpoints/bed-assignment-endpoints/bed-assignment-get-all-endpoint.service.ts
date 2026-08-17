import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class BedAssignGetAllService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments`;

  constructor(private http: HttpClient) {}

  getAll(params: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }
}
