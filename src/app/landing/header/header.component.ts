import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from 'src/app/theme/theme.service';
import { SheetComponent } from 'src/app/ui/sheet/sheet.component';
import { ThemeIconComponent } from 'src/app/ui/theme-icon/theme-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, SheetComponent, ThemeIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isDark = false;
  isBrowser = false;
  isMenuOpen = false;
  readonly lightLogoSrc = 'assets/imgs/logo-zapfarma/zapfarma-logo.png';
  readonly darkLogoSrc = 'assets/imgs/logo-zapfarma/zapfarma-logo-branca.png';
  readonly lightLogoWidth = 1695;
  readonly lightLogoHeight = 846;
  readonly darkLogoWidth = 540;
  readonly darkLogoHeight = 356;
  readonly lightSealSrc =
    'assets/imgs/logo-security/logo-meta/meta-tech-provider-black.png';
  readonly darkSealSrc =
    'assets/imgs/logo-security/logo-meta/meta-tech-provider-white.png';
  readonly lightSealWidth = 650;
  readonly lightSealHeight = 383;
  readonly darkSealWidth = 2688;
  readonly darkSealHeight = 1568;

  readonly mobileMenuPanelId = 'landing-mobile-menu';
  readonly mobileMenuTitleId = 'landing-mobile-menu-title';
  readonly mobileMenuDescriptionId = 'landing-mobile-menu-description';

  navLinks = [
    { href: '/#/home#sobre', label: 'Produto' },
    { href: '/#/home#como-funciona', label: 'IA & Automacao' },
    { href: '/#/home#resultados', label: 'Resultados' },
    { href: '/#/home#parceiros', label: 'Parceiros' },
    { href: '/#/home#planos', label: 'Planos' },
    { href: '/#/home#faq', label: 'FAQ' },
    { href: '/#/sobre', label: 'Quem somos' },
    { href: '/#/home#contato', label: 'Contato' },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.isDark = this.themeService.getTheme() === 'dark';
    this.preloadSealAssets();
    this.syncMenuWithViewport();
  }

  toggleDarkMode(): void {
    if (!this.isBrowser) {
      return;
    }
    this.themeService.toggleTheme();
    this.isDark = this.themeService.getTheme() === 'dark';
  }

  get logoSrc(): string {
    return this.isDark ? this.darkLogoSrc : this.lightLogoSrc;
  }

  get sealSrc(): string {
    return this.isDark ? this.darkSealSrc : this.lightSealSrc;
  }

  get logoWidth(): number {
    return this.isDark ? this.darkLogoWidth : this.lightLogoWidth;
  }

  get logoHeight(): number {
    return this.isDark ? this.darkLogoHeight : this.lightLogoHeight;
  }

  get sealWidth(): number {
    return this.isDark ? this.darkSealWidth : this.lightSealWidth;
  }

  get sealHeight(): number {
    return this.isDark ? this.darkSealHeight : this.lightSealHeight;
  }

  openMenu(): void {
    if (!this.isBrowser) {
      return;
    }
    this.isMenuOpen = true;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  handleMenuOpenChange(open: boolean): void {
    this.isMenuOpen = open;
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    if (!this.isBrowser || window.innerWidth < 1024 || !this.isMenuOpen) {
      return;
    }
    this.closeMenu();
  }

  private syncMenuWithViewport(): void {
    if (!this.isBrowser) {
      return;
    }
    if (window.innerWidth >= 1024) {
      this.isMenuOpen = false;
    }
  }

  private preloadSealAssets(): void {
    [this.lightSealSrc, this.darkSealSrc].forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }
}

