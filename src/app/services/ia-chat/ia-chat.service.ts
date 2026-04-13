import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface ChatIaCustomer {
  name?: string;
  phone?: string;
  city?: string;
}

export interface ChatIaRequest {
  message: string;
  sessionId?: string;
  customer?: ChatIaCustomer;
}

export interface ChatIaResponseData {
  sessionId: string;
  reply: string;
  responseId: string;
  usedTools: string[];
  escalatedToHuman: boolean;
}

export interface ChatIaResponse {
  ok: boolean;
  data: ChatIaResponseData;
}

export interface ChatIaClearSessionResponse {
  ok: boolean;
  data: {
    sessionId: string;
    removed: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IaChatService {
  private readonly chatUrl = `${environment.apiIa}/chat`;

  constructor(private readonly http: HttpClient) {}

  enviarMensagem(payload: ChatIaRequest): Observable<ChatIaResponse> {
    return this.http.post<ChatIaResponse>(this.chatUrl, payload);
  }

  encerrarSessao(sessionId: string): Observable<ChatIaClearSessionResponse> {
    const safeSessionId = encodeURIComponent(sessionId.trim());
    return this.http.delete<ChatIaClearSessionResponse>(
      `${this.chatUrl}/${safeSessionId}`
    );
  }
}
