import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from './services/test.service';
import { MyAuthService } from './services/auth-services/my-auth.service';
import { ThemeService } from './services/theme-service/theme.service';
import { FirebaseMessagingService } from './core/firebase/firebase-messaging.service';
import { LanguageService } from './core/i18n/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent  {
  message = '';
  currentTheme:'light' | 'dark'='light';

  // 👇 Dodajemo oba servisa i Router u konstruktor
  constructor(
    private testService: TestService,
    private authService: MyAuthService,
    private router: Router,
    private themeService:ThemeService,
    private firebaseMessaging: FirebaseMessagingService,
    private languageService: LanguageService,
    
  ) {}

  /*
  ngOnInit(): void {
    this.testService.testBackend().subscribe({
      next: (data: any) => (this.message = data),
      error: (err: any) => (this.message = 'Greška u vezi s backendom!')
    });
  }*/
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


  // 👇 Logout metoda ide izvan konstruktora
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.authService.setLoggedInUser(null);
        this.router.navigate(['login']);
      },
      error: (err: any) => console.error(err)
    });
  }
}
