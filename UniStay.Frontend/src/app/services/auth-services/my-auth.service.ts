import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export interface RememberedUser {
  email: string;
}

interface StoredAuthUser {
  token?: string | null;
  accessToken?: string | null;
  role?: string | null;
  roleName?: string | null;
  email?: string | null;
  userId?: number;
}

export interface AuthenticatedUser {
  id?: number;
  userID?: number;
  userId?: number;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  firstname?: string | null;
  lastName?: string | null;
  roleName?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  token?: string;
  refreshToken: string;
  expiresAtUtc: string;
  requiresTwoFactor: boolean;
  RequiresTwoFactor?: boolean;
  twoFactorChallengeId?: string | null;
  TwoFactorChallengeId?: string | null;
  userId: number;
  email?: string | null;
  Email?: string | null;
  theme?: string | null;
  roleName?: string | null;
  myAuthInfo?: {
    roleName?: string | null;
  } | null;
}

export interface RefreshSessionResponse {
  accessToken: string;
  AccessToken?: string;
  refreshToken: string;
  RefreshToken?: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
}

type RememberedUserStorageValue = string | Partial<RememberedUser> | null;


export type UserRole = 'employee' | 'student' | 'admin';
export type RawUserRole = UserRole | 'administrator' | string | null | undefined;

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {

  private apiUrl = 'http://localhost:5177/api'; 

  private loggedInUser: StoredAuthUser | null = null; 

  constructor(private http: HttpClient) { }

  setLoggedInUser(user: StoredAuthUser | null) {
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

  getLoggedInUser() {
    return this.loggedInUser;
  }

  login(email: string, password: string, rememberMe: boolean, fingerprint: string, captchaToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password, rememberMe, fingerprint, captchaToken },
    );
  }

  refreshSession(refreshToken: string, fingerprint?: string | null): Observable<RefreshSessionResponse> {
    return this.http.post<RefreshSessionResponse>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken, fingerprint }
    );
  }

  saveTokenPair(accessToken: string, refreshToken?: string | null): void {
    localStorage.setItem('token', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getDeviceFingerprint(): string | null {
    return localStorage.getItem('deviceFingerprint');
  }

  getRememberedUsers(): RememberedUser[] {
    const rememberedUsers = this.readRememberedUsers();
    localStorage.setItem('rememberedUsers', JSON.stringify(rememberedUsers));
    return rememberedUsers;
  }

  rememberEmail(email: string): RememberedUser[] {
    const normalizedEmail = email?.trim();
    if (!normalizedEmail) {
      return this.getRememberedUsers();
    }

    const rememberedUsers = this.getRememberedUsers();
    if (!rememberedUsers.some(x => x.email.toLowerCase() === normalizedEmail.toLowerCase())) {
      rememberedUsers.push({ email: normalizedEmail });
      localStorage.setItem('rememberedUsers', JSON.stringify(rememberedUsers));
    }

    return rememberedUsers;
  }

  logout(): Observable<unknown> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (!refreshToken) {
      this.clearSession();
      return of(null);
    }

    return this.http.post(`${this.apiUrl}/auth/logout`, { RefreshToken: refreshToken }, { headers }).pipe(
      catchError(error => {
        console.error('Error during logout:', error);
        return of(null);
      }),
      finalize(() => this.clearSession())
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
    sessionStorage.removeItem('2fa_challengeId');
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

  private userSubject = new BehaviorSubject<AuthenticatedUser | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: AuthenticatedUser | null) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }

  private readRememberedUsers(): RememberedUser[] {
    const raw = localStorage.getItem('rememberedUsers');
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      const values: RememberedUserStorageValue[] = Array.isArray(parsed) ? parsed : [];
      const emails = values
        .map(value => typeof value === 'string' ? value : value?.email)
        .filter((email): email is string => typeof email === 'string' && !!email.trim())
        .map(email => email.trim());

      return Array.from(new Set(emails.map(email => email.toLowerCase())))
        .map(lowerEmail => ({ email: emails.find(email => email.toLowerCase() === lowerEmail)! }));
    } catch {
      localStorage.removeItem('rememberedUsers');
      return [];
    }
  }
}
