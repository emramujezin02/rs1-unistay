// account.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  AnsweredSecurityQuestion,
  SendPasswordResetTokenResponse,
  SecurityQuestion,
  SetSecurityAnswersRequest,
  StartPasswordRecoveryResponse,
  VerifySecurityAnswersRequest,
  VerifySecurityAnswersResponse
} from './account-security.models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private base = `${MyConfig.baseUrl}/api/account`;
  constructor(private http: HttpClient) {}

  getQuestionsForUser(email?: string): Observable<SecurityQuestion[]> {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.http.get<SecurityQuestion[]>(`${this.base}/security/questions-for-user${query}`);
  }

  getAnsweredQuestions(email?: string): Observable<AnsweredSecurityQuestion[]> {
    const query = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.http.get<AnsweredSecurityQuestion[]>(`${this.base}/security/answered${query}`);
  }

  verifyAnswers(payload: VerifySecurityAnswersRequest): Observable<VerifySecurityAnswersResponse> {
    return this.http.post<VerifySecurityAnswersResponse>(`${this.base}/security/verify`, payload);
  }

  sendEmailToken(email: string): Observable<SendPasswordResetTokenResponse> {
    return this.http.post<SendPasswordResetTokenResponse>(`${this.base}/password/send-email-token?email=${encodeURIComponent(email)}`, {});
  }

  startPasswordRecovery(email: string): Observable<StartPasswordRecoveryResponse> {
    return this.http.post<StartPasswordRecoveryResponse>(`${this.base}/password/start-recovery?email=${encodeURIComponent(email)}`, {});
  }

  getRecoveryQuestions(recoveryContextId: string): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(
      `${this.base}/security/recovery-questions?recoveryContextId=${encodeURIComponent(recoveryContextId)}`
    );
  }

  resetPassword(payload: { token: string, newPassword: string }) {
    return this.http.post(`${this.base}/password/reset`, payload);
  }

  setSecurityAnswers(payload: SetSecurityAnswersRequest): Observable<object> {
    return this.http.post<object>(`${this.base}/security/set`, payload);
  }

  getAllQuestions(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(
      `${this.base}/security/questions`
    );
  }

  saveQuestions(payload: SetSecurityAnswersRequest): Observable<object> {
    return this.setSecurityAnswers(payload);
  }
}
