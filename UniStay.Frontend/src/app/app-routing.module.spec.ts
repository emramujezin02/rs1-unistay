import { routes } from './app-routing.module';
import { RoleGuard } from './auth-guards/role-guard.service';

describe('AppRoutingModule role guards', () => {
  [
    { path: 'admin', role: 'admin' },
    { path: 'employee', role: 'employee' },
    { path: 'student', role: 'student' }
  ].forEach(({ path, role }) => {
    it(`protects the ${path} root route with RoleGuard`, () => {
      const route = routes.find(item => item.path === path);

      expect(route).toBeTruthy();
      expect(route?.canActivate).toEqual([RoleGuard]);
      expect(route?.data?.['roles']).toEqual([role]);
    });
  });

  [
    'login',
    'register',
    'password-recovery',
    'two-factor'
  ].forEach(path => {
    it(`keeps ${path} public at the root routing layer`, () => {
      const route = routes.find(item => item.path === path);

      expect(route).toBeTruthy();
      expect(route?.canActivate).toBeUndefined();
    });
  });
});
