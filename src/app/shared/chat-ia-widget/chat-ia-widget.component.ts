import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { IaChatService } from 'src/app/services/ia-chat/ia-chat.service';

interface ChatMensagem {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  linhas: ChatMensagemLinha[];
}

interface ChatMensagemLinha {
  partes: ChatMensagemParte[];
  heading: boolean;
}

interface ChatMensagemParte {
  type: 'text' | 'link' | 'bold';
  value: string;
  href?: string;
}

@Component({
  selector: 'front-zapfarma-chat-ia-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-ia-widget.component.html',
  styleUrl: './chat-ia-widget.component.scss',
})
export class ChatIaWidgetComponent implements OnChanges {
  @Input() openOnInit = false;
  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  aberto = false;
  carregando = false;
  textoMensagem = '';
  erroEnvio = '';
  mensagens: ChatMensagem[] = [this.criarMensagemInicial()];

  private nextMessageId = 2;
  private sessionId = '';
  private readonly isBrowser: boolean;

  constructor(
    private readonly iaChatService: IaChatService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openOnInit']?.currentValue) {
      this.abrirJanela();
    }
  }

  alternarJanela(): void {
    if (this.aberto) {
      this.fecharJanela();
      return;
    }

    this.abrirJanela();
  }

  abrirJanela(): void {
    this.aberto = true;
    this.scrollParaFinal();
  }

  fecharJanela(): void {
    this.aberto = false;
  }

  enviarMensagem(): void {
    const mensagem = this.textoMensagem.trim();
    if (!mensagem || this.carregando) {
      return;
    }

    this.erroEnvio = '';
    this.adicionarMensagem('user', mensagem);
    this.textoMensagem = '';
    this.carregando = true;

    this.iaChatService
      .enviarMensagem({
        message: mensagem,
        sessionId: this.sessionId || undefined,
      })
      .pipe(
        finalize(() => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: (response) => {
          const sessionIdRecebido = response?.data?.sessionId?.trim();
          if (sessionIdRecebido) {
            this.sessionId = sessionIdRecebido;
          }

          const respostaIa = response?.data?.reply?.trim();
          if (!response?.ok || !respostaIa) {
            this.adicionarMensagem(
              'assistant',
              'Nao consegui gerar uma resposta agora. Tente novamente em alguns segundos.'
            );
            return;
          }

          this.adicionarMensagem('assistant', respostaIa);
        },
        error: () => {
          this.erroEnvio =
            'Nao foi possivel conectar ao assistente agora. Tente novamente.';
          this.adicionarMensagem(
            'assistant',
            'Estou com instabilidade no momento. Pode tentar novamente em instantes?'
          );
        },
      });
  }

  onMessageKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    this.enviarMensagem();
  }

  novaConversa(): void {
    if (this.carregando) {
      return;
    }

    const sessionIdAtual = this.sessionId;
    this.sessionId = '';
    this.erroEnvio = '';
    this.mensagens = [this.criarMensagemInicial()];
    this.nextMessageId = 2;
    this.scrollParaFinal();

    if (!sessionIdAtual) {
      return;
    }

    this.iaChatService.encerrarSessao(sessionIdAtual).subscribe({
      error: () => {
        // A limpeza remota da sessao nao bloqueia o reset local da conversa.
      },
    });
  }

  trackByMensagemId(_index: number, mensagem: ChatMensagem): number {
    return mensagem.id;
  }

  private criarMensagemInicial(): ChatMensagem {
    const content =
      'Oi, eu sou a IA da ZapFarma. Me conte sua duvida e eu te ajudo agora.';
    return {
      id: 1,
      role: 'assistant',
      content,
      linhas: this.construirLinhas(content),
    };
  }

  private adicionarMensagem(
    role: ChatMensagem['role'],
    content: string
  ): void {
    this.mensagens = [
      ...this.mensagens,
      {
        id: this.nextMessageId,
        role,
        content,
        linhas: this.construirLinhas(content),
      },
    ];
    this.nextMessageId += 1;
    this.scrollParaFinal();
  }

  private scrollParaFinal(): void {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;
      if (!container) {
        return;
      }
      container.scrollTop = container.scrollHeight;
    });
  }

  private construirLinhas(content: string): ChatMensagemLinha[] {
    const linhas = content.split('\n');
    return linhas.map((linha) => {
      const headingMatch = linha.match(/^\s*#{1,6}\s+(.+)$/);
      const textoLinha = headingMatch ? headingMatch[1].trim() : linha;

      return {
        partes: this.tokenizarLinha(textoLinha),
        heading: Boolean(headingMatch),
      };
    });
  }

  private tokenizarLinha(linha: string): ChatMensagemParte[] {
    const partes: ChatMensagemParte[] = [];
    const regexUrl = /https?:\/\/[^\s]+/gi;
    let cursor = 0;

    for (const match of linha.matchAll(regexUrl)) {
      const urlEncontrada = match[0];
      const inicio = match.index ?? 0;
      const fim = inicio + urlEncontrada.length;

      if (inicio > cursor) {
        partes.push(...this.tokenizarNegrito(linha.slice(cursor, inicio)));
      }

      const { urlLimpa, pontuacaoFinal } =
        this.separarPontuacaoFinal(urlEncontrada);

      if (urlLimpa) {
        partes.push({
          type: 'link',
          value: urlLimpa,
          href: urlLimpa,
        });
      }

      if (pontuacaoFinal) {
        partes.push(...this.tokenizarNegrito(pontuacaoFinal));
      }

      cursor = fim;
    }

    if (cursor < linha.length) {
      partes.push(...this.tokenizarNegrito(linha.slice(cursor)));
    }

    if (partes.length === 0) {
      partes.push({
        type: 'text',
        value: linha,
      });
    }

    return partes;
  }

  private tokenizarNegrito(texto: string): ChatMensagemParte[] {
    const partes: ChatMensagemParte[] = [];
    const regexNegrito = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let cursor = 0;

    for (const match of texto.matchAll(regexNegrito)) {
      const inicio = match.index ?? 0;
      const marcadorCompleto = match[0];
      const conteudo = (match[2] ?? match[3] ?? '').trim();

      if (inicio > cursor) {
        partes.push({
          type: 'text',
          value: texto.slice(cursor, inicio),
        });
      }

      if (conteudo) {
        partes.push({
          type: 'bold',
          value: conteudo,
        });
      } else {
        partes.push({
          type: 'text',
          value: marcadorCompleto,
        });
      }

      cursor = inicio + marcadorCompleto.length;
    }

    if (cursor < texto.length) {
      partes.push({
        type: 'text',
        value: texto.slice(cursor),
      });
    }

    return partes.length > 0
      ? partes
      : [
          {
            type: 'text',
            value: texto,
          },
        ];
  }

  private separarPontuacaoFinal(url: string): {
    urlLimpa: string;
    pontuacaoFinal: string;
  } {
    const pontuacao = url.match(/[.,!?;:)\]]+$/)?.[0] ?? '';
    if (!pontuacao) {
      return {
        urlLimpa: url,
        pontuacaoFinal: '',
      };
    }

    return {
      urlLimpa: url.slice(0, -pontuacao.length),
      pontuacaoFinal: pontuacao,
    };
  }
}
