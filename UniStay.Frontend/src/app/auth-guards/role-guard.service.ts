import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { MyAuthService, UserRole } from '../services/auth-services/my-auth.service';

export interface RoleGuardData {
  roles?: Array<UserRole | 'administrator'>;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: MyAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    const guardData = route.data as RoleGuardData;
    const requiredRoles = guardData.roles?.map(role => this.normalizeRole(role)) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const currentRole = this.normalizeRole(this.authService.getRole());
    if (currentRole && requiredRoles.includes(currentRole)) {
      return true;
    }

    return this.router.createUrlTree([this.getDefaultRoute(currentRole)]);
  }

  private normalizeRole(role: UserRole | 'administrator' | null): UserRole | null {
    return role === 'administrator' ? 'admin' : role;
  }

  private getDefaultRoute(role: UserRole | null): string {
    switch (role) {
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
}
