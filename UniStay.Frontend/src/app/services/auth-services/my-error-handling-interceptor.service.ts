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
        // 401 Unauthorized ili 403 Forbidden -> logout i redirect na login
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
          alert('Niste autorizovani. Prijavite se ponovo.');
        }
        // 400 Bad Request -> može prikazati poruku
        else if (error.status === 400) {
          alert('Neispravan zahtjev.');
        }
        // 404 Not Found
        else if (error.status === 404) {
          alert('Resurs nije pronađen.');
        }
        // 500 Internal Server Error
        else if (error.status >= 500) {
          alert('Greška na serveru. Pokušajte kasnije.');
        }

        // Log u konzolu ili poslati u log servis
        console.error('HTTP Error:', error);

        // prosledi error dalje
        return throwError(() => error);
      })
    );
  }
}
