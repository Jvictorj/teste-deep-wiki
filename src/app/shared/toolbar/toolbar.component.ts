import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

type NavLink = {
  label: string;
  description: string;
  icon: string;
  href?: string;
  routerLink?: string;
};

@Component({
  selector: 'front-zapfarma-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ToolbarComponent {
  mobileMenuOpen = false;
  userMenuOpen = false;

  readonly publicLinks: NavLink[] = [
    {
      label: 'Nossas lojas',
      description: 'Encontre o endereco mais proximo de voce.',
      icon: 'storefront',
      routerLink: '/nossas-lojas',
    },
  ];

  readonly privateLinks: NavLink[] = [
    {
      label: 'Dashboard do cliente',
      description: 'Metricas em tempo real e recomendacoes.',
      icon: 'dashboard',
      routerLink: '/dashboard',
    },
    {
      label: 'Configuracoes da IA',
      description: 'Edite fluxos, regras e integracoes.',
      icon: 'tune',
      routerLink: '/onboarding-ia/lista',
    },
    {
      label: 'Treinamentos e suporte',
      description: 'Base de conhecimento premium e chamados.',
      icon: 'school',
      routerLink: '/treinamentos',
    },
  ];

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  get isAuthenticated(): boolean {
    return this.usuariosService.logado;
  }

  get userName(): string {
    const usuario = this.usuariosService.obterUsuarioLogado;
    return usuario?.nome ?? '';
  }

  get userInitials(): string {
    if (!this.userName) {
      return '';
    }
    const partes = this.userName.trim().split(' ');
    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }
    const first = partes.shift() ?? '';
    const last = partes.pop() ?? '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  trackByLabel(_: number, link: NavLink): string {
    return link.label;
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.userMenuOpen = false;
    }
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    this.userMenuOpen = false;
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    if (!this.isAuthenticated) {
      return;
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.usuariosService.deslogar();
    this.userMenuOpen = false;
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      this.mobileMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.userMenuOpen = false;
    }
  }
}
