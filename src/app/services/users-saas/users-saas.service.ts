import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface UserCreatePayload {
  token?: string;
  companyId?: number;
  name: string;
  email: string;
  login?: string;
  password: string;
  profile?: string;
  queueIds?: number[];
  whatsappId?: number;
  allTicket?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersSaasService {
  constructor(private readonly httpClient: HttpClient) {}

  criarUsuario(payload: UserCreatePayload, usarEndpointPrivado: boolean): Observable<any> {
    const endpoint = usarEndpointPrivado ? '/users' : '/auth/signup';
    return this.httpClient.post(`${environment.apiProd}${endpoint}`, payload);
  }
}
