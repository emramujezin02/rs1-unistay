import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface UnassignBedResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BedAssignDeleteService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments`;

  constructor(private http: HttpClient) {}

  unassign(assignmentId: number): Observable<UnassignBedResponse> {
    return this.http.delete<UnassignBedResponse>(`${this.apiUrl}/${assignmentId}`);
  }
}
