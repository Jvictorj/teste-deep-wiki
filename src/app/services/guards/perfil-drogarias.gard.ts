import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class PerfilDrogariasGuard implements CanActivate {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    if (!this.usuariosService.logado) {
      this.router.navigate(['home']);
      return false;
    }

    if (this.usuariosService.podeAcessarTelaDrogariasLogado) {
      return true;
    }

    this.router.navigate(['dashboard']);
    return false;
  }
}
