import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { FreeBedsResponse } from './free-bed.models';

@Injectable({
  providedIn: 'root'
})
export class FreeBedGetAllEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/beds/free`;

  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 100): Observable<FreeBedsResponse> {
    const params = new HttpParams()
      .set('Paging.Page', pageNumber)
      .set('Paging.PageSize', pageSize);

    return this.http.get<FreeBedsResponse>(this.apiUrl, { params });
  }
}
