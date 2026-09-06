import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MyAuthService, UserRole } from '../services/auth-services/my-auth.service';
import { RoleGuard } from './role-guard.service';

describe('RoleGuard', () => {
  let authService: jasmine.SpyObj<MyAuthService>;
  let router: jasmine.SpyObj<Router>;
  let guard: RoleGuard;

  beforeEach(() => {
    authService = jasmine.createSpyObj<MyAuthService>('MyAuthService', ['isLoggedIn', 'getRole']);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    router.createUrlTree.and.callFake(commands => ({ commands } as any));
    guard = new RoleGuard(authService, router);
  });

  it('redirects anonymous users to login', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate(routeWithRoles(['admin']));

    expect(result).toEqual({ commands: ['/login'] } as any);
  });

  [
    { role: 'admin' as UserRole, path: '/admin' },
    { role: 'employee' as UserRole, path: '/employee' },
    { role: 'student' as UserRole, path: '/student' }
  ].forEach(({ role, path }) => {
    it(`allows ${role} users to access their root route`, () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getRole.and.returnValue(role);

      const result = guard.canActivate(routeWithRoles([role]));

      expect(result).toBeTrue();
      expect(router.createUrlTree).not.toHaveBeenCalledWith([path]);
    });
  });

  it('redirects authenticated users with the wrong role to their own dashboard', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getRole.and.returnValue('student');

    const result = guard.canActivate(routeWithRoles(['admin']));

    expect(result).toEqual({ commands: ['/student'] } as any);
  });

  it('allows authenticated users when no route roles are configured', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate(routeWithRoles(undefined));

    expect(result).toBeTrue();
  });
});

function routeWithRoles(roles: Array<UserRole | 'administrator'> | undefined): ActivatedRouteSnapshot {
  return { data: roles ? { roles } : {} } as ActivatedRouteSnapshot;
}
