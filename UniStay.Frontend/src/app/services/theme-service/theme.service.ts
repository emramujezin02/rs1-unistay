import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private currentTheme: 'light' | 'dark' = 'light';

  constructor(private http: HttpClient) {}

  initTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    this.currentTheme = saved || 'light';
    document.body.classList.add(this.currentTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // 🔥 OVO IDE OVDJE
  setTheme(theme: 'light' | 'dark', persist = true) {
    document.body.classList.remove(this.currentTheme);

    this.currentTheme = theme;
    document.body.classList.add(theme);

    localStorage.setItem('theme', theme);

    if (!persist) {
      return;
    }

    // Theme persistence is optional; local UI theme must not block login/routing.
    this.http.post(`${MyConfig.baseUrl}/api/users/theme`, { theme }).subscribe({
      error: () => {}
    });

  }

  getTheme() {
    return this.currentTheme;
  }
}
