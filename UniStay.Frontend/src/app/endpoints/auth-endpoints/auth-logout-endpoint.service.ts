import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MyConfig} from '../../my-config';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthLogoutEndpointService implements MyBaseEndpointAsync<void, void> {
  private apiUrl = `${MyConfig.baseUrl}/auth/logout`;

  constructor(private httpClient: HttpClient, private authService: MyAuthService) {
  }

  handleAsync() {
    return new Observable<void>((observer) => {
      this.httpClient.post<void>(this.apiUrl, {}).subscribe({
        next: () => {
          this.authService.setLoggedInUser(null); 
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('Error during logout:', error);
          observer.error(error);
          this.authService.setLoggedInUser(null); 
        }
      });
    });
  }
}
