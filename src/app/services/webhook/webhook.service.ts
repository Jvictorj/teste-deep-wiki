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
export class WebHookService {

    constructor(private _httpClient: HttpClient) {}

    enviarContatoWebHook(dados: any): Observable<any> {
        return this._httpClient
          .post(
            `${environment.urlWebHookProd}`,
            dados,
            httpOptions
          )
          .pipe(
            tap()
          );
      };

}
