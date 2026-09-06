import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { AssignBedRequest } from '../../modules/admin/bed-assignments/data/bed-assignments.models';

export interface AssignBedResponse {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BedAssignCreateService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments/assign`;

  constructor(private http: HttpClient) {}

  assign(request: AssignBedRequest): Observable<AssignBedResponse> {
    return this.http.post<AssignBedResponse>(this.apiUrl, request);
  }
}
