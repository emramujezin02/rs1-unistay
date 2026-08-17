import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MyAuthService } from './my-auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyErrorHandlingInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private authService: MyAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
          alert('Unauthorized. Please log in again');
        }
        else if (error.status === 400) {
          alert('Bad Request.');
        }
        else if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status >= 500) {
          alert('Server error. Please try again later');
        }

        console.error('HTTP Error:', error);

        return throwError(() => error);
      })
    );
  }
}
