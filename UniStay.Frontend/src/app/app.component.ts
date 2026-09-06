import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyAuthService } from './services/auth-services/my-auth.service';
import { ThemeService } from './services/theme-service/theme.service';
import { FirebaseMessagingService } from './core/firebase/firebase-messaging.service';
import { LanguageService } from './core/i18n/language.service';
import { prepareRoute, routeTransition } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
  animations: [routeTransition]
})
export class AppComponent  {
  message = '';
  currentTheme:'light' | 'dark'='light';
  readonly prepareRoute = prepareRoute;

  constructor(
    private authService: MyAuthService,
    private router: Router,
    private themeService:ThemeService,
    private firebaseMessaging: FirebaseMessagingService,
    private languageService: LanguageService,
    
  ) {}

ngOnInit(){
  this.languageService.init();
  this.themeService.initTheme();
  this.currentTheme=this.themeService.getTheme();
  this.firebaseMessaging.init();
}

toggleTheme(){
  this.themeService.toggleTheme();
  this.currentTheme=this.themeService.getTheme();
}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.authService.setLoggedInUser(null);
        this.router.navigate(['login']);
      },
      error: (err: unknown) => console.error(err)
    });
  }
}


