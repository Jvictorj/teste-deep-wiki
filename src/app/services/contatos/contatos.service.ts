import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environments';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


@Injectable()
export class ContatoService {

    constructor(private _httpClient: HttpClient) {}

    enviarContato(dados: any): Observable<any> {
        return this._httpClient
          .post(
            `${environment.apiProd}/contatos`,
            dados,
            httpOptions
          )
          .pipe(
            tap()
          );
      };

}
