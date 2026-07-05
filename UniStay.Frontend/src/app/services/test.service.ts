import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../my-config';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:5177/api'
  constructor(private http: HttpClient) {}

login(email: string, password: string) {
  return this.http.post(`${this.apiUrl}/login`, { email, password });
}

logout() {
  return this.http.post(`${this.apiUrl}/logout`, {});
}

getUserInfo() {
  return this.http.get(`${this.apiUrl}/me`);
}
/*
testBackend() {
  return this.http.get('http://localhost:5177/api/auth');
}*/
}
