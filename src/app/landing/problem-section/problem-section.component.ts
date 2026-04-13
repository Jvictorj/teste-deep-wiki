import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-problem-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './problem-section.component.html',
  styleUrl: './problem-section.component.scss',
})
export class ProblemSectionComponent {
  problems = [
    {
      icon: 'schedule',
      title: 'Cliente esperando, venda indo embora',
      description:
        'O cliente manda mensagem, não recebe resposta rápida e compra na farmácia que respondeu primeiro. Você nem fica sabendo.',
    },
    {
      icon: 'shopping_cart',
      title: 'Pedido abandonado no meio da conversa',
      description:
        '30% dos pedidos iniciados no WhatsApp não são finalizados. Cada conversa sem fechamento é receita que some sem deixar rastro.',
    },
    {
      icon: 'group',
      title: 'Sua equipe não foi contratada para isso',
      description:
        'Balconista respondendo WhatsApp enquanto atende a fila. Atendimento ruim nos dois lados e turnover alto de quem não aguenta o ritmo.',
    },
    {
      icon: 'bar_chart',
      title: 'Você tem volume, mas não tem controle',
      description:
        'Sem dados, sem histórico, sem visão de quem compra, quanto compra e quando some. Impossível crescer o que você não consegue enxergar.',
    },
  ];

  solutions = [
    { icon: 'chat_bubble_outline', title: 'Nunca some da conversa', description: 'Respostas instantâneas' },
    { icon: 'gps_fixed', title: 'Não depende de funcionário', description: '100% automatizado' },
    { icon: 'trending_up', title: 'Vende 24h por dia', description: 'Mesmo fora do horário' },
    { icon: 'shopping_bag', title: 'Recupera vendas perdidas', description: 'Clientes que iam desistir voltam a comprar' },
  ];
}
