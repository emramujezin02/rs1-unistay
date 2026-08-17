import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InviteRequest {
  email: string;
}

export interface InviteValidationResult {
  email: string;
  expiresAtUtc: string;
  isExpired: boolean;
  used: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InviteSendEndpointService {
  private apiUrl = 'http://localhost:5177/api';
  constructor(private http: HttpClient) {}

  sendInvite(request: InviteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/InviteFriendEndpoint`, request);
  }

  validateInviteToken(token: string): Observable<InviteValidationResult> {
    const params = new HttpParams().set('token', token);
    return this.http.get<InviteValidationResult>(`${this.apiUrl}/InviteFriendEndpoint/by-token`, { params });
  }
}
