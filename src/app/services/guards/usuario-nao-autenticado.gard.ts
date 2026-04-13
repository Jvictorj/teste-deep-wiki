import { UsuariosService } from './../usuarios/usuarios.service';
import { Component, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UsuarioNaoAutenticadoGuard implements CanActivate{
    constructor(
      private usuarioService: UsuariosService,
      private router: Router) { }
    canActivate(){
      if (this.usuarioService.logado) {
        if (this.usuarioService.podeGerenciarTudoLogado) {
          this.router.navigate(['dashboard']);
        } else if (this.usuarioService.podeAcessarTelaUsuariosLogado) {
          this.router.navigate(['usuarios-afiliados']);
        } else {
          this.router.navigate(['dashboard']);
        }
        return false;
      }
      return true;
    }
}
