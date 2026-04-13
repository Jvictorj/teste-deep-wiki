import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss',
})
export class FeaturesSectionComponent {
  features = [
    {
      icon: 'smart_toy',
      title: 'Vendas Automatizadas 24/7',
      description:
        'Sua IA atende, consulta estoque, sugere ofertas personalizadas e fecha a venda direto no WhatsApp, a qualquer hora.',
    },
    {
      icon: 'autorenew',
      title: 'Pós-Venda Inteligente',
      description:
        'Segmenta clientes e envia promoções e lembretes de recompra personalizados, impulsionando fidelidade e faturamento.',
    },
    {
      icon: 'shield',
      title: 'Segurança Anti-Banimento',
      description:
        'WhatsApp Business Cloud API oficial da Meta. Seu número protegido contra bloqueios com conversas profissionais.',
    },
    {
      icon: 'monitoring',
      title: 'Monitoramento Ativo',
      description:
        'Monitore o Status de Qualidade do seu WhatsApp e receba alertas proativos para agir antes de qualquer problema.',
    },
    {
      icon: 'link',
      title: 'Integração com ERP',
      description:
        'Conectamos ao seu sistema (como Alpha 7), garantindo que cada pedido seja registrado e faturado automaticamente.',
    },
    {
      icon: 'apartment',
      title: 'Múltiplas Unidades',
      description:
        'Seja uma única farmácia ou uma rede, gerencie cada operação de forma otimizada com solução customizada.',
    },
  ];
}
