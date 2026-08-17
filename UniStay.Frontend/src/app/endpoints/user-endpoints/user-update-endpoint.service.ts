import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MyConfig } from '../../my-config';
import { UserUpdateRequest } from './user.models';

export type { UserUpdateRequest } from './user.models';

export interface UserUpdateResponse {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserUpdateEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  updateUser(request: UserUpdateRequest): Observable<UserUpdateResponse> {
    const id = request.id ?? request.userID;
    if (!id) {
      throw new Error('User id is required for update.');
    }

    const { id: _id, userID: _userID, ...body } = request;
    return this.http.put<void>(`${this.apiUrl}/${id}`, body).pipe(map(() => ({ id })));
  }
}
