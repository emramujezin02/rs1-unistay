import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { BedAssignmentsResponse } from '../../modules/admin/bed-assignments/data/bed-assignments.models';

export interface BedAssignmentListParams {
  [key: string]: string | number | boolean | readonly (string | number | boolean)[];
  'Paging.Page': number;
  'Paging.PageSize': number;
  q: string;
}

@Injectable({
  providedIn: 'root'
})
export class BedAssignGetAllService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/bed-assignments`;

  constructor(private http: HttpClient) {}

  getAll(params: BedAssignmentListParams): Observable<BedAssignmentsResponse> {
    return this.http.get<BedAssignmentsResponse>(this.apiUrl, { params });
  }
}
