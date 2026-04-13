import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface IaConfiguracaoPayload {
  empresa: string;
  cnpj: string;
  responsavel: string;
  email: string;
  telefone: string;
  segmento: string;
  numeroFiliais: string;
  volumeAtendimentos: string;
  canaisAtendimento: string;
  sistemasIntegrados: string;
  objetivosIa: string;
  tomDeVoz: string;
  palavrasChave: string;
  baseConhecimento: string;
  horariosAtendimento: string;
  restricoes: string;
  observacoes: string;
  consentimentoLgpd: boolean;
  nomeIa: string;
  horarioAtendimento: string;
  taxaEntrega: string;
  valorIsencaoTaxa: string;
  trabalhaGenericos: string;
  servicosDrogaria: string;
  gatilhosTransferenciaHumano: string;
  programaPrecoPopular: string;
  numeroDelivery: string;
  formasPagamento: string;
  modeloPedido: string;
}

export interface IaConfiguracao extends IaConfiguracaoPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IaConfiguracaoListResponse {
  count: number;
  hasMore: boolean;
  iaConfigurations: any[];
}

@Injectable({
  providedIn: 'root',
})
export class IaConfiguracaoService {
  constructor(private http: HttpClient) {}

  salvarConfiguracao(payload: IaConfiguracaoPayload): Observable<unknown> {
    return this.http.post(
      `${environment.apiOnboarding}/ia-configuracoes`,
      payload
    );
  }

  listarConfiguracoes(): Observable<IaConfiguracaoListResponse> {
    return this.http.get<IaConfiguracaoListResponse>(
      `${environment.apiOnboarding}/ia-configuracoes`
    );
  }
}
