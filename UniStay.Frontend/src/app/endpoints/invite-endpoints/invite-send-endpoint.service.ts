import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InviteRequest {
  email: string;
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
}