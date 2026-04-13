import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './pricing-section.component.html',
  styleUrl: './pricing-section.component.scss',
})
export class PricingSectionComponent {
  plans = [
    {
      name: 'Plano Premium',
      description: 'Com Automação IA e Segurança Total',
      price: 'Sob Consulta',
      period: '',
      icon: 'workspace_premium',
      featured: true,
      features: [
        { text: 'Atendimento IA até 20.000/mês', included: true },
        { text: 'IA de Vendas Completa', included: true },
        { text: 'Pós-Venda e Promoções Inteligentes', included: true },
        { text: 'Integração completa com ERP', included: true },
        { text: 'Múltiplas unidades/CNPJs', included: true },
        { text: 'Monitoramento de Qualidade do Número', included: true },
        { text: 'WhatsApp Business Cloud API Meta', included: true },
        { text: 'Suporte prioritário', included: true },
      ],
      cta: 'Escolher o Premium',
    },
  ];
}
