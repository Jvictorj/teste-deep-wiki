import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme';
  private isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(defaultTheme: ThemeMode = 'light'): void {
    if (!this.isBrowser) return;

    const saved = this.normalizarTema(localStorage.getItem(this.storageKey));
    const temaFinal = saved ?? defaultTheme;
    localStorage.setItem(this.storageKey, temaFinal);
    this.applyTheme(temaFinal);
  }

  setTheme(theme: ThemeMode): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const current = this.getTheme();
    if (current === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  getTheme(): ThemeMode {
    if (!this.isBrowser) return 'light';
    return this.normalizarTema(localStorage.getItem(this.storageKey)) ?? 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    if (!this.isBrowser) return;
    const isDark = theme === 'dark';
    this.document.documentElement.classList.toggle('dark', isDark);
  }

  private normalizarTema(tema: string | null): ThemeMode | null {
    if (tema === 'light' || tema === 'dark') {
      return tema;
    }
    return null;
  }
}
