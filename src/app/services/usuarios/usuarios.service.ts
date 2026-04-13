// import { Usuarios } from './../../interfaces/usuarios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class UsuariosService {
  constructor(private _httpClient: HttpClient, private router: Router) {}

  private obterObjetoSessao(item: string): any {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    const valorSalvo = sessionStorage.getItem(item) ?? '';
    if (!valorSalvo) {
      return null;
    }

    try {
      return JSON.parse(atob(valorSalvo));
    } catch {
      return null;
    }
  }

  private obterPerfilDeOrigem(origem: any): string | null {
    if (!origem) {
      return null;
    }

    const perfil =
      origem?.perfil ?? origem?.profile ?? origem?.funcao_departamento ?? null;

    if (perfil === null || perfil === undefined) {
      return null;
    }

    const perfilNormalizado = `${perfil}`.trim();
    return perfilNormalizado ? perfilNormalizado : null;
  }

  private obterPerfilDoToken(token: string): string | null {
    if (!token || !token.includes('.')) {
      return null;
    }

    try {
      const payloadBase64Url = token.split('.')[1] ?? '';
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return this.obterPerfilDeOrigem(payload);
    } catch {
      return null;
    }
  }

  private obterTokenAutenticacao(): string {
    if (typeof sessionStorage === 'undefined') {
      return '';
    }

    const tokenSalvo = sessionStorage.getItem('token') ?? '';
    const usuarioSalvo = sessionStorage.getItem('usuario') ?? '';

    if (tokenSalvo.trim()) {
      // Token salvo em texto puro.
      if (tokenSalvo.includes('.')) {
        return tokenSalvo.trim();
      }

      // Compatibilidade com token legado em base64.
      try {
        const parseado = JSON.parse(atob(tokenSalvo));
        const tokenParseado = `${parseado ?? ''}`.trim();
        if (tokenParseado.includes('.')) {
          return tokenParseado;
        }
      } catch {
        // segue para outros fallbacks
      }

      try {
        const decodificado = atob(tokenSalvo).trim();
        if (decodificado.includes('.')) {
          return decodificado;
        }
      } catch {
        // segue para outros fallbacks
      }
    }

    // Fallback: token salvo dentro do objeto `usuario`.
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

  /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
  consultaUsuarios() {
    return this._httpClient.get(
      `${environment.apiProd}/zapfarma_representantes`,
      this.obterHttpOptions()
    );
  }

  /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
  consultaCpfUsuario(cpf: string) {
    return this._httpClient.get(
      `${environment.apiProd}/zapfarma_representantes/cpfCnpj/${cpf}`,
      this.obterHttpOptions()
    );
  }

  consultarCep(cep: string) {
    return this._httpClient.get(
      `https://viacep.com.br/ws/${cep}/json/`,
      httpOptions
    );
  }

  /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
  RecuperaSenhaUsuarios(email: any) {
    const data = {
      email: email
    }
    return this._httpClient.post(
      `${environment.apiProd}/zapfarma_representantes/recuperar-senha`,
      data,
      this.obterHttpOptions()
    );
  }


  AlterarSenhaUsuarios(id:any, senha: any) {
    const data = {
      id: id,
      senha: btoa(senha)
    }
    return this._httpClient.put(
      `${environment.apiProd}/zapfarma_representantes/alterar-senha/${id}`,
      data,
      this.obterHttpOptions()
    );
  }

  

  /**
   * Consultando Servicos na Servidor, retornando JSON Ge
   * @author Paulo Eduardo
   */
  AdicionarUsuarios(body: any) {
    const payload = { ...body };
    payload.senha = btoa(payload.senha);
    const emailNormalizado = `${payload.email ?? ''}`.trim().toLowerCase();
    const loginNormalizado = `${payload.login ?? ''}`.trim().toLowerCase();

    if (emailNormalizado) {
      payload.email = emailNormalizado;
    }

    if (loginNormalizado) {
      payload.login = loginNormalizado;
    } else if (emailNormalizado) {
      payload.login = emailNormalizado;
    }

    return this._httpClient.post(
      `${environment.apiProd}/zapfarma_representantes`,
      payload,
      this.obterHttpOptions()
    );
  }

  ExcluirUsuarios(id: any) {
    return this._httpClient.delete(
      `${environment.apiProd}/zapfarma_representantes/${id}`,
      this.obterHttpOptions()
    );
  }


  logar(usuario: any): Observable<any> {
    const payload = { ...usuario } as any;
    const loginInformado = `${payload.login ?? payload.email ?? ''}`
      .trim()
      .toLowerCase();

    payload.senha = btoa(payload.senha);
    if (loginInformado) {
      payload.login = loginInformado;

      if (loginInformado.includes('@')) {
        payload.email = loginInformado;
      } else {
        delete payload.email;
      }
    }

    return (
      this._httpClient
        .post(`${environment.apiProd}/zapfarma_representantes/login`,
        payload, 
        this.obterHttpOptions())
        .pipe(
          tap((resposta: any) => {
            if (Object.keys(resposta).length === 0) return;
            const tokenLogin =
              resposta?.token ??
              resposta?.accessToken ??
              resposta?.access_token ??
              resposta?.jwt ??
              null;

            if (tokenLogin) {
              sessionStorage.setItem('token', `${tokenLogin}`);
            } else {
              // Compatibilidade com backend legado sem JWT explícito.
              sessionStorage.setItem('token', btoa(JSON.stringify(resposta._id)));
            }
            sessionStorage.setItem('usuario', btoa(JSON.stringify(resposta)));
            // this.router.navigate(['home']);
          }),
          catchError(error => {
            // Here you can handle the error and retrieve the HTTP status code
            const statusCode = error.status;
            // Do something with the status code
            return throwError(error);
          })
        )
    );
  }

  alterarSenhaFormulario(usuario: any): Observable<any> {
    usuario.senha = btoa(usuario.senha);
    return this._httpClient
      .post(
        `${environment.apiProd}/usuarios/alterar-senha/${usuario.email}`,
        usuario,
        this.obterHttpOptions()
      )
      .pipe(
        // .post(`http://52.67.156.34:5050/usuarios/alterar-senha${usuario.email}`,usuario, httpOptions).pipe(
        tap()
      );
  }

  alterarCadastro(usuario: any): Observable<any> {
    const cpf: string = usuario.cpf;
    return this._httpClient
      .post(
        // `http://52.67.156.34:5050/usuarios/alterar-cadastro/${cpf}`,
        `${environment.apiProd}/usuarios/alterar-cadastro/${cpf}`,
        usuario,
        this.obterHttpOptions()
      )
      .pipe(
        tap()
      );
  }

  alterarSenha(usuario: any): Observable<any> {
    usuario.senha = btoa(usuario.senha);
    return this._httpClient
      .post(
        `${environment.apiProd}/sys-eventos-usuarios/alterar-senha/${usuario._id}`,
        usuario,
        this.obterHttpOptions()
      )
      .pipe(
        // .post(`http://52.67.156.34:5050/usuarios/alterar-senha${usuario.email}`,usuario, httpOptions).pipe(
        tap()
      );
  }

  recuperarSenha(usuario: any): Observable<any> {
    return this._httpClient
      .post(
        `${environment.apiProd}/sys-eventos-usuarios/recuperar-senha/${usuario.email}`,
        usuario,
        this.obterHttpOptions()
      )
      .pipe(
        // .post(`http://52.67.156.34:5050/usuarios/recuperar-senha/${usuario.email}`,usuario, httpOptions).pipe(
        tap()
      );
  }

  deslogar() {
    sessionStorage.clear();
    setTimeout(this.reload, 10);
  }

  reload() {
    window.location.reload();
  }
  
  get obterUsuarioLogado(): any {
    return this.obterObjetoSessao('usuario');
  }
  get obterIdUsuarioLogado(): any {
    const usuario = this.obterUsuarioLogado;
    return usuario?.id ?? null;
  }

  get obterPerfilUsuarioLogado(): any {
    const usuarioParseado = this.obterUsuarioLogado;
    const fontes = [
      usuarioParseado,
      usuarioParseado?.usuario,
      usuarioParseado?.user,
      usuarioParseado?.data,
      usuarioParseado?.representante,
    ];

    for (const origem of fontes) {
      const perfil = this.obterPerfilDeOrigem(origem);
      if (perfil) {
        return perfil;
      }
    }

    return this.obterPerfilDoToken(this.obterTokenAutenticacao());
  }

  get obterPerfilUsuarioLogadoNormalizado(): string {
    const perfil = `${this.obterPerfilUsuarioLogado ?? ''}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
    return perfil;
  }

  get perfilGerenciadorLogado(): boolean {
    return this.obterPerfilUsuarioLogadoNormalizado === 'gerenciador';
  }

  get perfilComercialLogado(): boolean {
    return this.obterPerfilUsuarioLogadoNormalizado === 'comercial';
  }

  get perfilRepresentanteLogado(): boolean {
    return this.obterPerfilUsuarioLogadoNormalizado === 'representante';
  }

  get obterUsuarioAdminLogado(): any {
    const usuario = this.obterUsuarioLogado;
    return usuario?.admin ?? usuario?.usuario?.admin ?? usuario?.user?.admin ?? null;
  }

  get obterUsuarioAdminSysLogado(): any {
    const usuario = this.obterUsuarioLogado;
    return (
      usuario?.superAdmin ??
      usuario?.admin_sys ??
      usuario?.usuario?.superAdmin ??
      usuario?.usuario?.admin_sys ??
      usuario?.user?.superAdmin ??
      usuario?.user?.admin_sys ??
      null
    );
  }

  get podeGerenciarTudoLogado(): boolean {
    return Boolean(
      this.obterUsuarioAdminLogado ||
      this.obterUsuarioAdminSysLogado ||
      this.perfilGerenciadorLogado
    );
  }

  get podeAcessarTelaUsuariosLogado(): boolean {
    return Boolean(this.perfilGerenciadorLogado);
  }

  get podeAcessarTelaDrogariasLogado(): boolean {
    return Boolean(
      this.podeGerenciarTudoLogado ||
      this.perfilComercialLogado ||
      this.perfilRepresentanteLogado
    );
  }

  get logado(): boolean {
    return sessionStorage.getItem('token') ? true : false;
  }

  
}
