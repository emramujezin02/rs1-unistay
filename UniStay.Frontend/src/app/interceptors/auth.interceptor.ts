import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';
import { MyAuthService } from '../services/auth-services/my-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshRequest$: Observable<string> | null = null;

  constructor(private injector: Injector, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const authReq = token ? this.addAuthorizationHeader(req, token) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 || this.shouldSkipRefresh(req)) {
          return throwError(() => error);
        }

        return this.handleUnauthorized(authReq, next);
      })
    );
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(MyAuthService);
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      this.endSession();
      return throwError(() => new Error('Refresh token is missing.'));
    }

    if (!this.refreshRequest$) {
      this.refreshRequest$ = authService.refreshSession(refreshToken, authService.getDeviceFingerprint()).pipe(
        switchMap(response => {
          const accessToken = response.accessToken ?? response.AccessToken;
          const newRefreshToken = response.refreshToken ?? response.RefreshToken;

          if (!accessToken) {
            this.endSession();
            return throwError(() => new Error('Refresh response did not include an access token.'));
          }

          authService.saveTokenPair(accessToken, newRefreshToken);
          return of(accessToken);
        }),
        catchError(error => {
          this.endSession();
          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay(1)
      );
    }

    return this.refreshRequest$.pipe(
      switchMap(accessToken => next.handle(this.addAuthorizationHeader(req, accessToken)))
    );
  }

  private addAuthorizationHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private shouldSkipRefresh(req: HttpRequest<any>): boolean {
    const url = req.url.toLowerCase();
    return url.includes('/api/auth/login') ||
      url.includes('/api/auth/refresh') ||
      url.includes('/api/auth/logout') ||
      url.includes('/api/account/2fa/verify') ||
      url.includes('/api/account/2fa/send-code') ||
      url.includes('/api/account/password/');
  }

  private endSession(): void {
    const authService = this.injector.get(MyAuthService);
    this.refreshRequest$ = null;
    authService.clearSession();
    this.router.navigate(['/login']);
  }
}
