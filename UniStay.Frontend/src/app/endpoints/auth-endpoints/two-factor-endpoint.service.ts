import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class TwoFactorService {
  private base = 'http://localhost:5177/api/account/2fa';

  constructor(private http: HttpClient) {}

  enable(userId:number): Observable<any> {
    return this.http.post(`${this.base}/enable`, { userId }, {withCredentials:true});
  }
  disable(userId:number): Observable<any> {
    return this.http.post(`${this.base}/disable`, { userId }, {withCredentials:true});
  }
  sendCode(userId:number): Observable<any> {
    return this.http.post(`${this.base}/send-code`, { userId }, {withCredentials:true});
  }
verify(userId:number, code:string, rememberMe:boolean, fingerprint:string) {
  return this.http.post(`${this.base}/verify`, { userId, code, rememberMe, fingerprint }, {withCredentials:true});
}
}
