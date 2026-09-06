import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../services/auth-services/my-auth.service';

export interface EnableTwoFactorResponse {
  backupCodes: string[];
}

@Injectable({providedIn:'root'})
export class TwoFactorService {
  private base = 'http://localhost:5177/api/account/2fa';

  constructor(private http: HttpClient) {}

  enable(): Observable<EnableTwoFactorResponse> {
    return this.http.post<EnableTwoFactorResponse>(`${this.base}/enable`, {}, {withCredentials:true});
  }
  disable(): Observable<object> {
    return this.http.post<object>(`${this.base}/disable`, {}, {withCredentials:true});
  }
  sendCode(challengeId?:string): Observable<object> {
    return this.http.post<object>(`${this.base}/send-code`, challengeId ? { challengeId } : {}, {withCredentials:true});
  }
verify(challengeId:string, code:string, rememberMe:boolean, fingerprint:string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.base}/verify`, { challengeId, code, rememberMe, fingerprint }, {withCredentials:true});
}
}
