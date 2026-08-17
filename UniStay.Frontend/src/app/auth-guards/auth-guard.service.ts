import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {MyAuthService} from '../services/auth-services/my-auth.service';

export class AuthGuardData {
  isAdmin?: boolean;
  isStudent?: boolean;
  isEmployee?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: MyAuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const guardData = route.data as AuthGuardData;  

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (guardData.isAdmin && !this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
      return false;
    }

    if (guardData.isEmployee && !this.authService.isEmployee()) {
      this.router.navigate(['/employee']);
      return false;
    }

    if (guardData.isStudent && !this.authService.isStudent()) {
      this.router.navigate(['/student']);
      return false;
    }

    return true; 
  }

}
