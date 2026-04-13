import { UsuariosService } from '../usuarios/usuarios.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioAutenticadoGuard implements CanActivate{
  usuario: any;
    constructor(
      private usuarioService: UsuariosService,
      private router: Router) { 
      }
    canActivate(){
      if (this.usuarioService.logado) {
        return true;
      }
      this.router.navigate(['home']);
      return false;
    }
}