import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-steps-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './steps-section.component.html',
  styleUrl: './steps-section.component.scss',
})
export class StepsSectionComponent {
  steps = [
    {
      number: 1,
      icon: 'link',
      title: 'Conecte sua farmácia',
      description: 'Integramos a Zapfarma ao seu sistema e deixamos tudo pronto para começar rapidamente.',
    },
    {
      number: 2,
      icon: 'settings',
      title: 'Configuramos para você',
      description: 'Criamos um atendimento personalizado com base no seu fluxo e nos seus produtos.',
    },
    {
      number: 3,
      icon: 'chat_bubble_outline',
      title: 'IA atendendo e vendendo',
      description: 'Seus clientes são atendidos no WhatsApp, encontram produtos e finalizam pedidos automaticamente.',
    },
    {
      number: 4,
      icon: 'trending_up',
      title: 'Você acompanha e cresce',
      description: 'Veja resultados em tempo real e use dados simples para aumentar ainda mais suas vendas.',
    },
  ];
}
