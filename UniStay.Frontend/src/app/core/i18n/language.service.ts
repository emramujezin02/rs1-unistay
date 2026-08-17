import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'bs' | 'en';

const STORAGE_KEY = 'unistay_lang';
const DEFAULT_LANGUAGE: AppLanguage = 'bs';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['bs', 'en'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private translate: TranslateService) {}

  init(): void {
    this.translate.addLangs(SUPPORTED_LANGUAGES);
    this.translate.setDefaultLang('en');
    this.translate.use(this.getSavedLanguage());
  }

  setLanguage(language: AppLanguage): void {
    this.translate.use(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  getCurrentLanguage(): AppLanguage {
    const current = this.translate.currentLang as AppLanguage | undefined;
    return current ?? this.getSavedLanguage();
  }

  instant(key: string): string {
    return this.translate.instant(key);
  }

  private getSavedLanguage(): AppLanguage {
    const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
  }
}
