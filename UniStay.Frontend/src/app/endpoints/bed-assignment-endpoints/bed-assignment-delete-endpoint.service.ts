import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class BedAssignDeleteService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments`;

  constructor(private http: HttpClient) {}

  unassign(assignmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${assignmentId}`);
  }
}
