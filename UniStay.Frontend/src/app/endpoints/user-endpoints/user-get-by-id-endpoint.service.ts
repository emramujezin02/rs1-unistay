import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { UserDto } from './user.models';

export type UserGetByIdResponse = UserDto;

@Injectable({
  providedIn: 'root'
})
export class UserGetByIdEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<UserGetByIdResponse> {
    return this.http.get<UserGetByIdResponse>(`${this.apiUrl}/${id}`);
  }
}
