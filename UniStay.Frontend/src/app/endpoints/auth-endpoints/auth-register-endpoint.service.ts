import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  captchaToken: string;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/auth/register`;

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, request);
  }
}
