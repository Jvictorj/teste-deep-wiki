import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent {
  faqs = [
    {
      question: 'A Zapfarma é compatível com meu sistema atual?',
      answer:
        'Já realizamos integrações com o sistema Alpha 7 e, caso sua farmácia use outro sistema, nosso time pode desenvolver sem custos com seu ERP essa integração. Isso é fundamental para a autonomia da venda, pois precisamos consultar estoque, preços, campanhas, cadastro de clientes e finalização de pedidos.',
      open: false,
    },
    {
      question: 'Preciso ter conhecimento técnico avançado para usar a Zapfarma?',
      answer:
        'Não. A Zapfarma foi desenvolvida para ser intuitiva. Oferecemos todo o treinamento e suporte necessário para que você e sua equipe usem a plataforma sem dificuldades.',
      open: false,
    },
    {
      question: 'Como funciona a gestão para farmácias com múltiplos CNPJs?',
      answer:
        'Trabalhamos com um modelo que permite a operação independente de cada unidade (CNPJ) dentro da plataforma. Para redes maiores, podemos customizar uma solução que atenda perfeitamente suas necessidades e também centralizar dados para relatórios de todos os números assistidos.',
      open: false,
    },
    {
      question: 'Qual o retorno esperado do investimento?',
      answer:
        'Clientes Zapfarma relatam aumento de faturamento, otimização do tempo da equipe e uma melhora significativa na experiência do cliente, resultando em mais vendas e fidelização. O investimento se paga rapidamente com o volume de vendas gerado pela automação e a proteção do seu ativo mais valioso: seu número de WhatsApp.',
      open: false,
    },
    {
      question: 'Como é o suporte da Zapfarma?',
      answer:
        'Oferecemos suporte completo via WhatsApp, telefone através do nosso suporte, vídeo conferência e acesso remoto. Isso tudo para garantir que você aproveite ao máximo a Zapfarma. Estamos com seu time desde a integração até o uso diário da plataforma.',
      open: false,
    },
    {
      question: 'O que é o Selo Azul do WhatsApp? Como a Zapfarma pode ajudar?',
      answer:
        'O Selo Azul é uma verificação oficial do WhatsApp para contas comerciais de notoriedade. A Zapfarma é uma parceira oficial do Meta e oferece um serviço de consultoria premium para auxiliar farmácias elegíveis na preparação da documentação e submissão da solicitação, aumentando sua credibilidade e segurança do número da central de vendas.',
      open: false,
    },
  ];

  toggle(index: number): void {
    this.faqs = this.faqs.map((faq, i) => ({
      ...faq,
      open: i === index ? !faq.open : false,
    }));
  }
}
