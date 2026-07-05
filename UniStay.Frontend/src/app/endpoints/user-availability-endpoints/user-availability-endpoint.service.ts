import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { UserAvailabilityApiResponse, UserAvailabilityResult } from './user-availability.models';

@Injectable({
  providedIn: 'root'
})
export class UserAvailabilityEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/users`;

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<UserAvailabilityResult> {
    const params = new HttpParams().set('email', email);
    return this.checkAvailability('check-email', params);
  }

  checkUsername(username: string): Observable<UserAvailabilityResult> {
    const params = new HttpParams().set('username', username);
    return this.checkAvailability('check-username', params);
  }

  private checkAvailability(path: string, params: HttpParams): Observable<UserAvailabilityResult> {
    return this.http.get<UserAvailabilityApiResponse>(`${this.apiUrl}/${path}`, { params }).pipe(
      map(response => ({
        isAvailable: response.isAvailable ?? response.IsAvailable ?? false
      }))
    );
  }
}
