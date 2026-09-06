import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { of, Subject, throwError, firstValueFrom } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { MyAuthService, RefreshSessionResponse } from '../services/auth-services/my-auth.service';
import { Router } from '@angular/router';

describe('AuthInterceptor refresh flow', () => {
  let authService: jasmine.SpyObj<MyAuthService>;
  let injector: jasmine.SpyObj<Injector>;
  let router: jasmine.SpyObj<Router>;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    authService = jasmine.createSpyObj<MyAuthService>('MyAuthService', [
      'getRefreshToken',
      'getDeviceFingerprint',
      'refreshSession',
      'saveTokenPair',
      'clearSession'
    ]);
    injector = jasmine.createSpyObj<Injector>('Injector', ['get']);
    injector.get.and.returnValue(authService);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    interceptor = new AuthInterceptor(injector, router);
  });

  it('adds the current access token without refreshing a successful request', async () => {
    localStorage.setItem('token', 'access-old');
    authService.getRefreshToken.and.returnValue('refresh-old');
    const req = new HttpRequest('GET', 'http://localhost:5177/api/favorites');
    const next = {
      handle: jasmine.createSpy('handle').and.callFake((request: HttpRequest<any>) => {
        expect(request.headers.get('Authorization')).toBe('Bearer access-old');
        return of(new HttpResponse({ status: 200 }));
      })
    };

    await firstValueFrom(interceptor.intercept(req, next));

    expect(authService.refreshSession).not.toHaveBeenCalled();
  });

  it('refreshes on 401, stores the rotated token pair, and retries the original request', async () => {
    localStorage.setItem('token', 'access-old');
    authService.getRefreshToken.and.returnValue('refresh-old');
    authService.getDeviceFingerprint.and.returnValue('device-1');
    authService.refreshSession.and.returnValue(of({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
      accessTokenExpiresAtUtc: '2026-09-05T10:00:00Z',
      refreshTokenExpiresAtUtc: '2026-09-05T11:00:00Z'
    }));

    let call = 0;
    const req = new HttpRequest('GET', 'http://localhost:5177/api/favorites');
    const next = {
      handle: jasmine.createSpy('handle').and.callFake((request: HttpRequest<any>) => {
        call++;
        if (call === 1) {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }

        expect(request.headers.get('Authorization')).toBe('Bearer access-new');
        return of(new HttpResponse({ status: 200 }));
      })
    };

    await firstValueFrom(interceptor.intercept(req, next));

    expect(authService.refreshSession).toHaveBeenCalledOnceWith('refresh-old', 'device-1');
    expect(authService.saveTokenPair).toHaveBeenCalledOnceWith('access-new', 'refresh-new');
    expect(next.handle).toHaveBeenCalledTimes(2);
  });

  it('shares one refresh request across concurrent 401 responses', async () => {
    localStorage.setItem('token', 'access-old');
    authService.getRefreshToken.and.returnValue('refresh-old');
    authService.getDeviceFingerprint.and.returnValue('device-1');

    const refresh$ = new Subject<RefreshSessionResponse>();
    authService.refreshSession.and.returnValue(refresh$);

    const next = {
      handle: jasmine.createSpy('handle').and.callFake((request: HttpRequest<any>) => {
        if (request.headers.get('Authorization') === 'Bearer access-old') {
          return throwError(() => new HttpErrorResponse({ status: 401 }));
        }

        return of(new HttpResponse({ status: 200 }));
      })
    };

    const req1 = new HttpRequest('GET', 'http://localhost:5177/api/favorites');
    const req2 = new HttpRequest('GET', 'http://localhost:5177/api/notifications');
    const result1 = firstValueFrom(interceptor.intercept(req1, next));
    const result2 = firstValueFrom(interceptor.intercept(req2, next));

    expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    refresh$.next({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
      accessTokenExpiresAtUtc: '2026-09-05T10:00:00Z',
      refreshTokenExpiresAtUtc: '2026-09-05T11:00:00Z'
    });
    refresh$.complete();

    await Promise.all([result1, result2]);

    expect(authService.saveTokenPair).toHaveBeenCalledOnceWith('access-new', 'refresh-new');
    expect(next.handle).toHaveBeenCalledTimes(4);
  });

  it('does not refresh the refresh endpoint and clears session on refresh failure', async () => {
    localStorage.setItem('token', 'access-old');
    authService.getRefreshToken.and.returnValue('refresh-old');
    authService.refreshSession.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    const req = new HttpRequest('GET', 'http://localhost:5177/api/favorites');
    const next = {
      handle: jasmine.createSpy('handle').and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })))
    };

    await expectAsync(firstValueFrom(interceptor.intercept(req, next))).toBeRejected();

    expect(authService.clearSession).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);

    const refreshReq = new HttpRequest('POST', 'http://localhost:5177/api/auth/refresh', {});
    await expectAsync(firstValueFrom(interceptor.intercept(refreshReq, next))).toBeRejected();

    expect(authService.refreshSession).toHaveBeenCalledTimes(1);
  });
});
