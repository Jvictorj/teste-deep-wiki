import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface CompanyCreatePayload {
  name: string;
  email?: string;
  planId?: number;
  status?: boolean;
  phone?: string;
  dueDate?: string;
  recurrence?: string;
  address?: string;
  responsible?: string;
  cnpj?: string;
  campaignsEnabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private readonly httpClient: HttpClient) {}

  criarEmpresa(payload: CompanyCreatePayload, usarEndpointPrivado: boolean): Observable<any> {
    const endpoint = usarEndpointPrivado ? '/companies' : '/companies/cadastro';
    return this.httpClient.post(`${environment.apiProd}${endpoint}`, payload);
  }
}
