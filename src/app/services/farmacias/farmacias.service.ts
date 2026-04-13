// import { Usuarios } from './../../interfaces/usuarios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { UsuariosService } from '../usuarios/usuarios.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  }),
};

@Injectable()
export class FarmaciasService {
  usuario: any
  constructor(
    private _httpClient: HttpClient, 
    private router: Router,
    private _usuariosService: UsuariosService,
    
  ) {
      this.usuario = this._usuariosService.obterUsuarioLogado;
    }

  private obterTokenAutenticacao(): string {
    if (typeof sessionStorage === 'undefined') {
      return '';
    }

    const tokenSalvo = sessionStorage.getItem('token') ?? '';
    const usuarioSalvo = sessionStorage.getItem('usuario') ?? '';

    if (tokenSalvo.trim()) {
      if (tokenSalvo.includes('.')) {
        return tokenSalvo.trim();
      }

      try {
        const parseado = JSON.parse(atob(tokenSalvo));
        const tokenParseado = `${parseado ?? ''}`.trim();
        if (tokenParseado.includes('.')) {
          return tokenParseado;
        }
      } catch {
        // segue para os outros fallbacks
      }

      try {
        const decodificado = atob(tokenSalvo).trim();
        if (decodificado.includes('.')) {
          return decodificado;
        }
      } catch {
        // segue para os outros fallbacks
      }
    }

    try {
      const usuario = JSON.parse(atob(usuarioSalvo));
      const tokenUsuario =
        usuario?.token ??
        usuario?.accessToken ??
        usuario?.access_token ??
        usuario?.jwt ??
        '';
      return `${tokenUsuario}`.trim();
    } catch {
      return '';
    }
  }

  private obterHttpOptions() {
    let headers = httpOptions.headers;
    const token = this.obterTokenAutenticacao();
    if (token) {
      headers = headers.set(
        'Authorization',
        token.startsWith('Bearer ') ? token : `Bearer ${token}`
      );
    }
    return { headers };
  }

  private obterIdUsuarioAtual(): string {
    const idDoUsuarioService = this._usuariosService.obterIdUsuarioLogado;
    const idDoUsuarioCache = this.usuario?.id;
    const idDoUsuarioLegado = this.obterIdUsuarioLogado;
    const idResolvido = idDoUsuarioService ?? idDoUsuarioCache ?? idDoUsuarioLegado ?? '';

    return `${idResolvido}`.trim();
  }

  /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
  consultarFarmacias() {
    return this._httpClient.get(
      `${environment.apiProd}/zapfarma_farmacias`,
      this.obterHttpOptions()
    );
  }

   /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
   consultarFarmaciasAfiliados() {
    const idUsuario = this.obterIdUsuarioAtual();
    return this._httpClient.get(
      `${environment.apiProd}/zapfarma_farmacias/representantes/${idUsuario}`,
      this.obterHttpOptions()
    );
  }

     /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
     consultarFarmaciasAfiliadosCPF(id:string) {
      return this._httpClient.get(
        `${environment.apiProd}/zapfarma_farmacias/representantes/${id}`,
        this.obterHttpOptions()
      );
    }
  


    /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
    consultarFarmaciasId(id:any) {
      return this._httpClient.get(
        `${environment.apiProd}/zapfarma_farmacias/${id}`,
        this.obterHttpOptions()
      );
    }


        /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
        consultarFarmaciasPorCnpj(cpfCnpj:any) {
          return this._httpClient.get(
            `${environment.apiProd}/zapfarma_farmacias/cpfCnpj/${cpfCnpj}`,
            this.obterHttpOptions()
          );
        }
    

  

    /**
     * Consultando Servicos na Servidor, retornando JSON Ge
     * @author Paulo Eduardo
     */
    AdicionarFarmacias(body: any) {
      if (body.senha) {
        body.senha = btoa(body.senha);
      }
      const usuario = this.obterUsuarioLogado || this.usuario;
      body.idRepresentantes = body.idRepresentantes || usuario?.id;
      return this._httpClient.post(
        `${environment.apiProd}/zapfarma_farmacias`,
        body,
        this.obterHttpOptions()
      );
    }


       /**
     * Consultando Servicos na Servidor, retornando JSON Ge
     * @author Paulo Eduardo
     */
       AtualizarFarmacias(body: any, id: any) {
        if (body.senha) {
          body.senha = btoa(body.senha);
        }
        const usuario = this.obterUsuarioLogado || this.usuario;
        body.idRepresentantes = body.idRepresentantes || usuario?.id;
        body.id = id;
        return this._httpClient.put(
          `${environment.apiProd}/zapfarma_farmacias/${body.id}`,
          body,
          this.obterHttpOptions()
        );
      }

      ExcluirFarmacias(id: any) {
        return this._httpClient.delete(
          `${environment.apiProd}/zapfarma_farmacias/${id}`,
          this.obterHttpOptions()
        );
      }
  
  get obterUsuarioLogado(): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usuario: string = sessionStorage.getItem('usuario')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? sessionStorage.getItem('usuario')!
      : '';
    return Object.keys(usuario).length > 0 ? JSON.parse(atob(usuario)) : null;
  }
  get obterIdUsuarioLogado(): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usuario: string = sessionStorage.getItem('usuario')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? sessionStorage.getItem('usuario')!
      : '';
    return Object.keys(usuario).length > 0
      ? JSON.parse(atob(usuario)).id
      : null;
  }

  get obterPerfilUsuarioLogado(): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usuario: any = sessionStorage.getItem('usuario')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? sessionStorage.getItem('usuario')!
      : {};
    if (Object.keys(usuario).length === 0) {
      return null;
    }
    const usuarioParseado = JSON.parse(atob(usuario));
    return usuarioParseado.perfil ?? usuarioParseado.funcao_departamento ?? null;
  }

  get obterUsuarioAdminLogado(): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usuario: any = sessionStorage.getItem('usuario')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? sessionStorage.getItem('usuario')!
      : {};
    return Object.keys(usuario).length > 0
      ? JSON.parse(atob(usuario)).admin
      : null;
  }

  get obterUsuarioAdminSysLogado(): any {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usuario: any = sessionStorage.getItem('usuario')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ? sessionStorage.getItem('usuario')!
      : {};
    if (Object.keys(usuario).length === 0) {
      return null;
    }
    const usuarioParseado = JSON.parse(atob(usuario));
    return usuarioParseado.superAdmin ?? usuarioParseado.admin_sys ?? null;
  }

  get logado(): boolean {
    return sessionStorage.getItem('token') ? true : false;
  }

  
}
