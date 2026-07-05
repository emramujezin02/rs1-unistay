import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { InviteApiResult, InviteResult } from './invite.models';

@Injectable({
  providedIn: 'root'
})
export class InviteAdminEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/InviteFriendEndpoint`;

  constructor(private http: HttpClient) {}

  create(email: string): Observable<InviteResult> {
    return this.http.post<InviteApiResult>(this.apiUrl, { email }).pipe(
      map(result => ({
        inviteId: String(result.inviteId ?? result.InviteId ?? ''),
        email: result.email ?? result.Email ?? email,
        expiresAt: result.expiresAt ?? result.ExpiresAt ?? result.expiresAtUtc ?? result.ExpiresAtUtc ?? ''
      }))
    );
  }
}
