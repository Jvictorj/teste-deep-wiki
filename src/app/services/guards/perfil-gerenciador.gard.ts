import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilGerenciadorGuard implements CanActivate {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    if (!this.usuariosService.logado) {
      this.router.navigate(['home']);
      return false;
    }

    if (this.usuariosService.podeGerenciarTudoLogado) {
      return true;
    }

    this.router.navigate(['usuarios-afiliados']);
    return false;
  }
}
