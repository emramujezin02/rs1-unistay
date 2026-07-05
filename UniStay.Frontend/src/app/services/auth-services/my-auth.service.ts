import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginTokenDto } from './dto/login-token-dto';


export type UserRole = 'employee' | 'student' | 'admin';
export type RawUserRole = UserRole | 'administrator' | string | null | undefined;

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {

  private apiUrl = 'http://localhost:5177/api'; // <-- PRAVI BACKEND URL

  private loggedInUser: any = null; // ✅ dodano

  constructor(private http: HttpClient) { }

  // ✅ Dodano — čuva korisnika u memoriji i localStorage
  setLoggedInUser(user: any) {
    this.loggedInUser = user;

    if (user?.token) {
      localStorage.setItem('token', user.token);
    }

    if (user?.role) {
      localStorage.setItem('role', user.role);
    }

    if (user?.email) {
      localStorage.setItem('email', user.email);
    }
  }

  // ✅ Dodano — vraća ulogovanog korisnika
  getLoggedInUser() {
    return this.loggedInUser;
  }

  login(email: string, password: string, rememberMe: boolean, fingerprint: string, captchaToken: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/auth/login`,
      { email, password, rememberMe, fingerprint, captchaToken },
     // {withCredentials:true}
    );
  }

  logout(): Observable<unknown> {
    const token = localStorage.getItem('token');
    this.clearSession();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post('http://localhost:5177/api/auth/logout', {}, { headers }).pipe(
      catchError(error => {
        console.error('Error during logout:', error);
        return of(null);
      })
    );
  }

  setSession(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', this.normalizeRole(role) ?? role);

  }

  clearSession(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('2fa_userId');
    sessionStorage.removeItem('2fa_email');
    sessionStorage.removeItem('2fa_fingerprint');
    sessionStorage.removeItem('rememberMe');
    this.loggedInUser=null;
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isEmployee(): boolean {
    return localStorage.getItem('role') === 'employee';
  }

  isStudent(): boolean {
    return localStorage.getItem('role') === 'student';
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): UserRole | null {
    return this.normalizeRole(localStorage.getItem('role'));
  }

  normalizeRole(role: RawUserRole): UserRole | null {
    const normalized = role?.toString().toLowerCase();

    if (normalized === 'administrator' || normalized === 'admin') {
      return 'admin';
    }

    if (normalized === 'employee') {
      return 'employee';
    }

    if (normalized === 'student') {
      return 'student';
    }

    return null;
  }

  getDashboardRouteForRole(role: RawUserRole): string {
    switch (this.normalizeRole(role)) {
      case 'admin':
        return '/admin';
      case 'employee':
        return '/employee';
      case 'student':
        return '/student';
      default:
        return '/login';
    }
  }

  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }
}
