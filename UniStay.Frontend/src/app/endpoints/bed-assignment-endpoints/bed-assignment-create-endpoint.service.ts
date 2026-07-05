import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class BedAssignCreateService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments/assign`;

  constructor(private http: HttpClient) {}

  assign(request: any): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
}
