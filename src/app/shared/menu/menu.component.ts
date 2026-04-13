import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {MatSidenav, MatSidenavModule,} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'front-zapfarma-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    ToolbarComponent,
    MatMenuModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class frontZapFarmaMenuComponent {
  perfilUsuario = true
  admin = true
  admin_sys = false
  podeGerenciarTudo = false;
  podeAcessarTelaDrogarias = false;
  podeAcessarTelaUsuarios = false;
  usuarioLogado:any;
  usuario:any;
  iniciaisLogado: '';
  primeiroNome: '';
  showButton = false;

  @Input() onMenu = false;
  @ViewChild('mySidepanel') mySidepanel: ElementRef<HTMLDivElement> = {} as ElementRef;;
  @ViewChild('divElements') divElements: ElementRef<HTMLDivElement> = {} as ElementRef;;
  @ViewChild('itemColor') itemColor: ElementRef<HTMLSpanElement> = {} as ElementRef;;  constructor (
    private router: Router, 
    private _usuariosService: UsuariosService,
  ) {
    this.usuario = this._usuariosService.obterUsuarioLogado;
    this.admin = this._usuariosService.obterUsuarioAdminLogado
    this.admin_sys = this._usuariosService.obterUsuarioAdminSysLogado
    this.perfilUsuario = this._usuariosService.obterPerfilUsuarioLogado
    this.podeGerenciarTudo = this._usuariosService.podeGerenciarTudoLogado;
    this.podeAcessarTelaDrogarias =
      this._usuariosService.podeAcessarTelaDrogariasLogado;
    this.podeAcessarTelaUsuarios = this._usuariosService.podeAcessarTelaUsuariosLogado;
    this.usuarioLogado = this._usuariosService.obterUsuarioLogado
    this.primeiroNome = this.usuarioLogado ? this.usuarioLogado.nome.replace(/ .*/,'') :'';
    this.onMenu = this.usuarioLogado ? true : false;

  }
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = false;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;

  ngOnInit(): void {
    this.getIniciais();
  }

  ngAfterViewInit(): void {
    this.showButton = true;
  }

  openNav() {
    const panelWidth = Math.min(window.innerWidth - 12, 320);
    this.mySidepanel.nativeElement.style.width = `${panelWidth}px`;
  }
  
  closeNav() {
    this.mySidepanel.nativeElement.style.width = '0'
    // this.divElements.nativeElement.style.display = 'none'
  }

  onLogOut() {
    this._usuariosService.deslogar();    
  }

  goNovaSenha() {
    this.router.navigate(['/alterar-senha']);
  }

  goMinhaConta() {
    this.router.navigate(['/dashboard']);
  }

  goRecuperarSenha() {
    this._usuariosService.deslogar();    
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  getIniciais() {
    const name = this.usuarioLogado ? this.usuarioLogado.nome : '';
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/u, 'gu');
    const letras = [...name.matchAll(rgx)];  
    const iniciais =  (letras.shift()?.[1] || '') + (letras.pop()?.[1] || '')
    this.iniciaisLogado = iniciais.toUpperCase();
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }

  // sair() {
  //   this._usuariosService.deslogar();
  //   this.router.navigate(['/login'])
  // }

}
