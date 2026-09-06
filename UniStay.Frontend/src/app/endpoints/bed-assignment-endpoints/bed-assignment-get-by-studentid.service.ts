import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { BedAssignmentApiItem } from '../../modules/admin/bed-assignments/data/bed-assignments.models';

@Injectable({
  providedIn: 'root'
})
export class BedAssignGetByStudentService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments/student`;

  constructor(private http: HttpClient) {}

  getByStudent(studentId: number): Observable<BedAssignmentApiItem> {
    return this.http.get<BedAssignmentApiItem>(`${this.apiUrl}/${studentId}`);
  }
}
