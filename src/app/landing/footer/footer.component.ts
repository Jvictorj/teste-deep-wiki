import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  year = new Date().getFullYear();

  productLinks = [
    { href: '/#/home#sobre', label: 'Produto' },
    { href: '/#/home#como-funciona', label: 'IA & Automação' },
    { href: '/#/home#recursos', label: 'Recursos' },
  ];

  companyLinks = [
    { href: '/#/sobre', label: 'Quem somos' },
    { href: '/#/trabalhe-conosco', label: 'Trabalhe conosco' },
    { href: '/#/home#planos', label: 'Planos' },
    { href: '/#/home#faq', label: 'FAQ' },
    { href: '/#/home#contato', label: 'Suporte' },
  ];

  socialLinks = [
    {
      href: 'https://www.instagram.com/zapfarmaoficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      icon: 'social-instagram',
      label: 'Instagram',
    },
    {
      href: 'https://www.facebook.com/zapfarmaoficial/',
      icon: 'social-facebook',
      label: 'Facebook',
    },
  ];

  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.registerSocialIcons();
  }

  private registerSocialIcons(): void {
    this.iconRegistry.addSvgIconLiteral(
      'social-instagram',
      this.sanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" ry="5.2" fill="none" stroke="currentColor" stroke-width="1.9"/>
          <circle cx="12" cy="12" r="4.15" fill="none" stroke="currentColor" stroke-width="1.9"/>
          <circle cx="17.35" cy="6.65" r="1.15" fill="currentColor"/>
        </svg>
      `)
    );

    this.iconRegistry.addSvgIconLiteral(
      'social-facebook',
      this.sanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="currentColor" d="M13.63 20v-6.2h2.08l.31-2.42h-2.39V9.83c0-.7.19-1.18 1.2-1.18H16V6.48c-.2-.03-.88-.08-1.67-.08-1.65 0-2.77 1-2.77 2.86v2.12H9.7v2.42h1.86V20h2.07Z"/>
        </svg>
      `)
    );
  }
}

