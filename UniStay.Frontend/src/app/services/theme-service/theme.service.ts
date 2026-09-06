import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyConfig } from '../../my-config';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private currentTheme: 'light' | 'dark' = 'light';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  initTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    this.currentTheme = saved || 'light';
    document.body.classList.add(this.currentTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark', persist = true) {
    document.body.classList.remove(this.currentTheme);

    this.currentTheme = theme;
    document.body.classList.add(theme);

    localStorage.setItem('theme', theme);

    if (!persist) {
      return;
    }

    this.http.post(`${MyConfig.baseUrl}/api/users/theme`, { theme }).subscribe({
      error: () => {
        this.snackBar.open('Unable to save theme preference.', 'OK', { duration: 3000 });
      }
    });

  }

  getTheme() {
    return this.currentTheme;
  }
}
