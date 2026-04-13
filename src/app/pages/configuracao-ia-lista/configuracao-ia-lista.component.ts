import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';
import {
  IaConfiguracao,
  IaConfiguracaoService,
  IaConfiguracaoListResponse,
} from '../../services/ia-configuracao/ia-configuracao.service';

@Component({
  selector: 'front-zapfarma-configuracao-ia-lista',
  standalone: true,
  templateUrl: './configuracao-ia-lista.component.html',
  styleUrls: ['./configuracao-ia-lista.component.scss'],
  imports: [CommonModule, ToolbarComponent, RodapeComponent],
})
export class ConfiguracaoIaListaComponent implements OnInit {
  configuracoes: IaConfiguracao[] = [];
  carregando = false;
  erro: string | null = null;
  totalRegistros = 0;
  hasMore = false;

  constructor(private iaConfiguracaoService: IaConfiguracaoService) {}

  ngOnInit(): void {
    this.carregarConfiguracoes();
  }

  carregarConfiguracoes(): void {
    this.carregando = true;
    this.erro = null;

    this.iaConfiguracaoService.listarConfiguracoes().subscribe({
      next: (dados: IaConfiguracaoListResponse) => {
        this.configuracoes = dados.iaConfigurations || dados.iaConfigurations || [];
        this.totalRegistros = dados.count;
        this.hasMore = dados.hasMore;
        this.carregando = false;
      },
      error: () => {
        this.erro =
          'Não foi possível buscar as configurações. Tente novamente em instantes.';
        this.carregando = false;
      },
    });
  }

  trackByConfigId(_: number, config: IaConfiguracao): number {
    return config.id;
  }

  formatTelefone(valor: string): string {
    const digits = (valor || '').replace(/\D/g, '');
    if (digits.length < 10) {
      return valor;
    }
    const d = digits.padEnd(11, '0');
    return `(${d.substring(0, 2)}) ${d.substring(2, 7)}-${d.substring(7, 11)}`;
  }

  formatCnpj(valor: string): string {
    const digits = (valor || '').replace(/\D/g, '').padStart(14, '0');
    if (digits.length !== 14) {
      return valor;
    }
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(
      5,
      8
    )}/${digits.substring(8, 12)}-${digits.substring(12)}`;
  }

  formatCurrency(valor: string): string {
    if (!valor) {
      return 'R$ 0,00';
    }
    const normalizado = valor.replace('R$', '').trim().replace('.', '').replace(',', '.');
    const numero = Number(normalizado);
    if (isNaN(numero)) {
      const digits = valor.replace(/[^\d]/g, '');
      if (!digits) {
        return 'R$ 0,00';
      }
      return (Number(digits) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
