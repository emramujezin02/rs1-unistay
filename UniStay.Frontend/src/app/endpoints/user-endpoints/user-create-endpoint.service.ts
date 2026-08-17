import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { UserCreateRequest, UserCreateResponse } from './user.models';

export type { UserCreateRequest, UserCreateResponse } from './user.models';

@Injectable({
  providedIn: 'root'
})
export class UserCreateEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  createUser(request: UserCreateRequest): Observable<UserCreateResponse> {
    return this.http.post<UserCreateResponse>(this.apiUrl, request);
  }
}
