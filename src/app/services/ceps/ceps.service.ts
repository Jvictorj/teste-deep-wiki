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
export class CepsService {
  constructor(private _httpClient: HttpClient, private router: Router) {}

  consultarCep(cep: string) {
    return this._httpClient.get(
      `${environment.apiProd}/busca_ceps/${cep}`,
      httpOptions
    );
  }

  consultarFamraciasAfiliadas() {
    return this._httpClient.get(
      `${environment.apiProd}/farmacias_representadas`,
      httpOptions
    );
  }
}
