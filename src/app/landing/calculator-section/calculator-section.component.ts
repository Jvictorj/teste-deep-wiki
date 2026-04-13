import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calculator-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './calculator-section.component.html',
  styleUrl: './calculator-section.component.scss',
})
export class CalculatorSectionComponent {
  pedidos = 200;
  vendas = 43;
  ticket = 52;

  get results() {
    const conversaoAtual = this.vendas > 0 && this.pedidos > 0 ? (this.vendas / this.pedidos) * 100 : 0;
    const faturamentoAtual = this.vendas * this.ticket * 30;
    const conversaoZapfarma = Math.min(conversaoAtual + 15, 100);
    const vendasZapfarma = (this.pedidos * conversaoZapfarma) / 100;
    const faturamentoZapfarma = vendasZapfarma * this.ticket * 30;
    const crescimento = faturamentoZapfarma - faturamentoAtual;

    return {
      conversaoAtual: conversaoAtual.toFixed(1),
      faturamentoAtual: this.formatCurrency(faturamentoAtual),
      conversaoZapfarma: conversaoZapfarma.toFixed(1),
      faturamentoZapfarma: this.formatCurrency(faturamentoZapfarma),
      crescimento: this.formatCurrency(crescimento),
    };
  }

  onNumberInput(value: string): number {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}




