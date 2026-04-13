import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type ChatAttachmentKind = 'recipe' | 'medicine' | 'audio';

type ChatAttachment = {
  kind: ChatAttachmentKind;
  title: string;
  subtitle?: string;
  meta?: string;
  duration?: string;
  badge?: string;
  audioSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
};

type ChatMessage = {
  side: 'incoming' | 'outgoing';
  lines: string[];
  time: string;
  sender?: string;
  solid?: boolean;
  highlightIndex?: number;
  blurLineIndices?: number[];
  attachment?: ChatAttachment;
};

type OutgoingStatus = 'sent' | 'delivered' | 'read';

type ConversationScenario = {
  buttonLabel: string;
  contactName: string;
  messages: ChatMessage[];
};

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('phoneFrame') phoneFrame?: ElementRef<HTMLDivElement>;
  @ViewChild('conversationTabList')
  conversationTabList?: ElementRef<HTMLDivElement>;
  @ViewChildren('conversationTabButton')
  conversationTabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  private playbackTimer?: ReturnType<typeof setTimeout>;
  private restartTimer?: ReturnType<typeof setTimeout>;
  private visibilityObserver?: IntersectionObserver;
  private isHeroChatVisible = true;
  private shouldResumePlaybackWhenVisible = false;
  private shouldAutoScrollChat = true;
  private programmaticScrollLock = false;
  private programmaticScrollReleaseTimer?: ReturnType<typeof setTimeout>;
  private tabScrollFrame?: number;
  private tabScrollSettleFrame?: number;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  private readonly allConversations: ConversationScenario[] = [
    {
      buttonLabel: 'Conversa 1',
      contactName: 'Gloria',
      messages: [
        {
          side: 'incoming',
          lines: ['Boa noite. Ainda dá pra pedir entrega?'],
          time: '19:39',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Bem-vindo à Drogaria!',
            '🚚 Receba seu pedido no conforto de casa!',
            'Entrega por apenas R$ 5,00.',
            'Qual seu nome, por favor?',
          ],
          time: '19:40',
        },
        {
          side: 'incoming',
          lines: ['Gloria'],
          time: '19:41',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Olá, Gloria! Quais produtos você precisa hoje?'],
          time: '19:41',
        },
        {
          side: 'incoming',
          lines: ['Rosuvastatina 10mg', 'Sinvastatina 20mg'],
          time: '19:41',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Rosuvastatina 10 mg, 30 comprimidos, da Neo Química (genérico) por R$ 13,79. E Sinvastatina 20 mg, 30 comprimidos, da Sandoz por R$ 6,19. Deseja que eu reserve algum desses para você? Se sim, qual?',
          ],
          time: '19:41',
        },
         {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Rosuvastatina 10 mg, 30 comprimidos por R$ 62,27. É um similar da rosuvastatina cálcica, ativo no controle do colesterol. Também temos Sinvastatina 20 mg, 30 comprimidos da Globo por R$ 6,89. Deseja levar algum desses? Se sim, qual?',
          ],
          time: '19:42',
        },
        {
          side: 'incoming',
          lines: ['Tem promoção levando 3 caixas?'],
          time: '19:42',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Não encontrei promoções específicas para levar 3 caixas de Rosuvastatina 10mg ou Sinvastatina 20mg. Posso ajudar com mais alguma coisa?',
          ],
          time: '19:42',
        },
        {
          side: 'incoming',
          lines: ['1 cx de rosubastatina 10mg', '3 cxs sinvastatina  20mg'],
          time: '19:44',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Rosuvastatina 10 mg com 30 comprimidos da Neo Química por R$ 13,79. Trata-se do genérico que contém o princípio ativo rosuvastatina cálcica, indicado para o controle do colesterol. Deseja esse produto?',
            'Temos Sinvastatina 20 mg 30 comprimidos da Globo por R$ 6,89. Para as 3 caixas, fica ótimo para seu uso. Posso reservar para você?',
          ],
          time: '19:45',
        },
        {
          side: 'incoming',
          lines: ['Este pedido'],
          time: '19:45',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Resumo do pedido',
            '🛍️ Itens:',
            '- 1 caixa Rosuvastatina 10 mg por R$ 13,79',
            '- 3 caixas Sinvastatina 20 mg por R$ 6,89 cada',
            '💰Subtotal: R$ 33,46',
            '🚚 Taxa de entrega: R$ 5,00',
            'Por favor, informe o endereço completo para entrega.',
          ],
          time: '19:46',
        },
        {
          side: 'incoming',
          lines: ['Pode pagar no cartão?'],
          time: '19:46',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Sim, pode pagar no cartão. Você prefere cartão de débito ou crédito?',
          ],
          time: '19:47',
        },
        {
          side: 'incoming',
          lines: ['Crédito visa'],
          time: '19:47',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, informe o endereço completo para entrega, incluindo número e ponto de referência, se possível.',
          ],
          time: '19:47',
        },
        {
          side: 'incoming',
          lines: [
            'Rua professor Alcebiades Monteiro Lt20 qd83 C1 Jardim Meriti.',
            'Rua do pub gato negro. Tb dá desativada fábrica Temporal onde vai ser construído o parque',
          ],
          time: '19:48',
          blurLineIndices: [0, 1],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Qual o seu nome completo, por favor?'],
          time: '19:48',
        },
        {
          side: 'incoming',
          lines: ['Meu nome é Gloria'],
          time: '19:48',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Gloria, qual o CPF para registro do pedido?'],
          time: '19:48',
        },
        {
          side: 'incoming',
          lines: ['Precisa do CPF?'],
          time: '19:50',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Para confirmar seu cadastro e emitir o pedido, o CPF é necessário. Pode informar, por favor? Se preferir, podemos seguir sem ele, mas o CPF ajuda no registro correto.',
          ],
          time: '19:50',
        },
        {
          side: 'incoming',
          lines: ['Prefiro sem o CPF'],
          time: '19:50',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Entendido, Gloria. Qual a forma de pagamento? Você mencionou cartão de crédito Visa, correto? Posso seguir com essa informação?',
          ],
          time: '19:51',
        },
        {
          side: 'incoming',
          lines: ['Correto'],
          time: '19:51',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Gloria, confirme por favor o resumo do pedido:',
            '- 1 caixa Rosuvastatina 10 mg por R$ 13,79',
            '- 3 caixas Sinvastatina 20 mg por R$ 6,89 cada',
            '- Entrega: Rua professor Alcebiades Monteiro Lt20 qd83 C1 Jardim Meriti, próximo ao pub gato negro e antiga fábrica Temporal',
            '- Pagamento: Cartão de crédito Visa',
            '- Taxa de entrega: R$ 5,00',
            'Está tudo correto para finalizar?',
          ],
          time: '19:51',
          blurLineIndices: [3],
        },
        {
          side: 'incoming',
          lines: ['Correto. Os 5,00 paga direto pro motoboy?'],
          time: '19:52',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Sim, Maria da Gloria, os R$ 5,00 da entrega são pagos diretamente para o motoboy no momento da entrega. Posso finalizar seu pedido?',
          ],
          time: '19:52',
        },
        {
          side: 'incoming',
          lines: ['Pode sim'],
          time: '19:52',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Maria da Gloria, seu pedido foi finalizado com sucesso. Em breve, receberá no endereço informado. Qualquer coisa, estou à disposição! Entrega por apenas R$ 5,00.',
          ],
          time: '19:52',
          solid: true,
        },
        {
          side: 'incoming',
          lines: ['Pede pro motoboy trazer troco pra 10,00'],
          time: '19:53',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Maria da Gloria, seu pedido está confirmado com troco para 10,00. O motoboy trará o troco no momento da entrega. Qualquer coisa, estou à disposição! Entrega por apenas R$ 5,00.',
          ],
          time: '19:53',
        },
        {
          side: 'incoming',
          lines: ['Obrigado'],
          time: '19:54',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'De nada, Maria da Gloria! Qualquer necessidade, é só chamar. Tenha um ótimo dia!',
          ],
          time: '19:54',
          solid: true,
        },
      ],
    },


    {
      buttonLabel: 'Conversa 2',
      contactName: 'Carla',
      messages: [
        {
          side: 'incoming',
          lines: ['Bom dia!'],
          time: '09:26',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Bem-vindo à Drogaria!',
            'Receba seu pedido no conforto de casa!',
            'Como posso te ajudar?',
          ],
          time: '09:26',
        },
        {
          side: 'incoming',
          lines: ['Transamin, por favor.'],
          time: '09:27',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Temos Transamin 12 cápsulas 250 mg por R$ 73,89. Atende?',
            'Caso prefira uma opção similar, encontrei também Ácido Tranexâmico 250 mg',
            '12 cápsulas Legrand genérico por R$ 49,89, que contém o mesmo princípio',
            'ativo do Transamin. Quer que eu separe para você?',
          ],
          time: '09:27',
        },
        {
          side: 'incoming',
          lines: ['Sim, quero o Transamin mesmo.'],
          time: '09:27',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: ['Quantas unidades de Transamin 12 cápsulas 250 mg você deseja?'],
          time: '09:28',
        },
        {
          side: 'incoming',
          lines: ['Só 1 unidade.'],
          time: '09:28',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Anotado 1 unidade de Transamin 12 cápsulas 250 mg.',
            'Por favor, qual o seu nome para registro do pedido?',
          ],
          time: '09:28',
        },
        {
          side: 'incoming',
          lines: ['Cliente', 'Carla'],
          time: '09:28',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Obrigado, Cliente.',
            'Por favor, informe o endereço completo para entrega, incluindo rua, número,',
            'complemento e ponto de referência, se possível.',
          ],
          time: '09:28',
        },
        {
          side: 'incoming',
          lines: ['Rua Belkiss..., nº **, Aptº **', 'Coelho da R...'],
          time: '09:29',
          blurLineIndices: [0, 1],
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Anotado o endereço: Rua Belkiss, 860, Aptº 3**, Coelho da Rocha.',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '09:29',
          blurLineIndices: [0],
        },
        {
          side: 'incoming',
          lines: ['Cartão de débito.'],
          time: '09:29',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Resumo do pedido:',
            'Itens: 1 unidade (Transamin 12 cápsulas 250 mg)',
            'Total: R$ 73,89',
            'Taxa de entrega: R$ 5,00',
            'Endereço: Rua Belkiss, 860, Aptº 3**, Coelho da Rocha',
            'Pagamento: Cartão de débito',
            'Este orçamento é válido apenas para hoje.',
            'Confirma o pedido para que eu possa finalizar?',
          ],
          time: '09:29',
          blurLineIndices: [4],
        },
        {
          side: 'incoming',
          lines: ['Confirmo o pedido.'],
          time: '09:30',
        },
        {
          side: 'outgoing',
          sender: 'IA Zapfarma',
          lines: [
            'Pedido confirmado e enviado com sucesso!',
            'Em até 60 minutos você receberá seu Transamin 12 cápsulas 250 mg',
            'no endereço informado. A entrega custa R$ 5,00.',
            'Obrigado por escolher a Zapfarma!',
          ],
          time: '09:30',
          solid: true,
        },
      ],
    },
    {
      buttonLabel: 'Conversa 3',
      contactName: 'Carol',
      messages: [
        {
          side: 'incoming',
          lines: ['Boa noite'],
          time: '21:33',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Bem-vindo à Drogaria!',
            '🚚 Receba seu pedido no conforto de casa!',
            'Entrega por apenas R$ 5,00.',
            'Qual seu nome, por favor?',
          ],
          time: '21:33',
        },
        {
          side: 'incoming',
          lines: ['Carol'],
          time: '21:33',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Olá, Carol! Quais produtos você precisa hoje?'],
          time: '21:33',
        },
        {
          side: 'incoming',
          lines: ['Vocês vende Polaramine'],
          time: '21:35',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Temos Polaramine 2 mg com 20 comprimidos por R$ 31,09. Atende?'],
          time: '21:35',
        },
        {
          side: 'incoming',
          lines: ['Tem mas em conta remédio para empolação'],
          time: '21:36',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Para empolação, temos Imescard pomada 25 g por R$ 50,97. Essa pomada ajuda a aliviar irritações na pele com ação calmante e cicatrizante. Gostaria de incluir essa pomada no seu pedido?',
          ],
          time: '21:36',
        },
        {
          side: 'incoming',
          lines: ['Pode ser o Polaramine então'],
          time: '21:37',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado o Polaramine 2 mg com 20 comprimidos. Quantas unidades você deseja?',
          ],
          time: '21:37',
        },
        {
          side: 'incoming',
          lines: ['1'],
          time: '21:37',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, me informe seu endereço completo com número, complemento e, se possível, um ponto de referência para a entrega.',
          ],
          time: '21:37',
        },
        {
          side: 'incoming',
          lines: ['Rua Capivari lote 18 Quadra 15 , bairro vilar dos Teles'],
          time: '21:38',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Obrigado pelo endereço, Carol. Falta o número da residência e se há algum complemento ou ponto de referência para facilitar a entrega. Poderia informar, por favor?',
          ],
          time: '21:38',
        },
        {
          side: 'incoming',
          lines: ['Próximo ao bar da lora , subir o morro atrás da casa e vídeo'],
          time: '21:38',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Perfeito, Carol. Agora, qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '21:38',
        },
        {
          side: 'incoming',
          lines: ['Pix'],
          time: '21:38',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'O pagamento via Pix poderá ser feito no momento da entrega, sem problemas.',
            'Resumo do pedido',
            '🛍️ Itens: 1 unidade (Polaramine 2 mg com 20 comprimidos, )',
            '💰 Total: R$ 31,09',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua Capivari lote 18 Quadra 15, bairro Vilar dos Teles, próximo ao bar da Lora, subir o morro atrás da casa e vídeo',
            '💳 Pagamento: Pix no momento da entrega',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Confirma o pedido, por favor?',
          ],
          time: '21:38',
          blurLineIndices: [5],
        },
        {
          side: 'incoming',
          lines: ['Sim'],
          time: '21:39',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Pedido confirmado e enviado com sucesso, Carol! Qualquer coisa, estou à disposição. Obrigado por escolher a IA Zapfarma!',
          ],
          time: '21:39',
          solid: true,
        },
      ],
    },
    {
      buttonLabel: 'Conversa 4',
      contactName: 'Cliente',
      messages: [
        {
          side: 'incoming',
          lines: ['Boa tarde'],
          time: '14:01',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Bem-vindo à Drogaria!',
            '🚚 Entrega grátis em compras a partir de R$ 40,00',
            'Qual seu nome, por favor?',
          ],
          time: '14:01',
        },
        {
          side: 'incoming',
          lines: ['Queria saber valor desses produtos'],
          time: '14:02',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Como posso te ajudar? Por favor, informe os nomes ou descrições dos produtos que deseja saber o valor.',
          ],
          time: '14:02',
        },
        {
          side: 'incoming',
          lines: ['Listerine exaguante bucal valor?'],
          time: '14:04',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Olá! Para o enxaguante bucal Listerine, temos as seguintes opções disponíveis:',
            '- Listerine 500 ml Cool Mint por R$ 24,99',
            '- Listerine 500 ml Melancia/Hortelã por R$ 19,97 — aproveite essa oferta!',
            '- Listerine 250 ml Cuidado Total Zero por R$ 19,99',
            '- Listerine 500 ml Cuidado Total Zero por R$ 28,99',
            '- Listerine 250 ml Melancia/Hortelã por R$ 14,99',
            'Se quiser, posso separar algum para você. Qual prefere?',
          ],
          time: '14:04',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, informe qual dos Listerine listados você gostaria de saber se temos disponível para confirmar para você.',
          ],
          time: '14:06',
        },
        {
          side: 'incoming',
          lines: ['Quero 1 listerine sabor melancia de 19,97'],
          time: '14:05',
        },
        {
          side: 'incoming',
          lines: ['Ana Carla', 'Esse tem?'],
          time: '14:06',
          attachment: {
            kind: 'medicine',
            title: 'Imagem enviada',
            subtitle: 'Produto consultado pelo cliente',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/locao-hidratante-conversa-4.jpg',
            imageAlt: 'Foto da loção hidratante consultada na conversa 4',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o Listerine 500 ml Melancia/Hortelã exatamente como solicitou:',
            'Listerine 500 Ml Melancia/hortela O',
            'Preço: R$ 19,97',
            'Código:',
            'Se desejar, posso ajudar com mais alguma coisa!',
          ],
          time: '14:06',
        },
        {
          side: 'incoming',
          lines: ['Loção hidratante paixão Brighton tem?'],
          time: '14:07',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você a Loção Hidratante da linha Paixão Bridgerton 200 ml Dama de Prata:',
            '- Preço: R$ 9,99',
            '- Código:',
            'Se desejar, posso incluir no seu pedido. Gostaria de algum outro produto da linha?',
          ],
          time: '14:07',
        },
        {
          side: 'incoming',
          lines: ['Vou querer os dois produtos'],
          time: '14:08',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Perfeito! Vou separar para você:',
            '- 1 Listerine 500 ml Melancia/Hortelã por R$ 19,97',
            '- 1 Loção Hidratante Paixão Bridgerton 200 ml Dama de Prata por R$ 9,99',
            'Por favor, informe seu endereço completo para entrega.',
          ],
          time: '14:08',
        },
        {
          side: 'incoming',
          lines: ['1 pacote de mucilom sabor multi cereias'],
          time: '14:08',
          attachment: {
            kind: 'medicine',
            title: 'Imagem enviada',
            subtitle: 'Produto consultado pelo cliente',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/mucilon-multicereais-conversa-4.jpg',
            imageAlt: 'Imagem do Mucilon Multicereais enviada na conversa 4',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o Mucilon 360g Multicereais Sachet por R$ 9,49. Este produto corresponde exatamente ao sabor multicereais que você solicitou.',
            'Posso incluir este item no seu pedido?',
          ],
          time: '14:09',
        },
        {
          side: 'incoming',
          lines: ['Isso'],
          time: '14:09',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o Mucilon 360g Multicereais Sachet por R$ 9,49.',
            'Quer que eu reserve para você?',
            'Além disso, temos o endereço cadastrado Rua Botafogo 20 - quadra 229 para entrega. Confirma esse endereço?',
          ],
          time: '14:09',
          blurLineIndices: [2],
        },
        {
          side: 'incoming',
          lines: ['Endereço:Rua Botafogo lote 20 quadra 229'],
          time: '14:09',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Endereço confirmado: Rua Botafogo, lote 20, quadra 229.',
            'Resumo do pedido:',
            '- 1 Listerine 500 ml Melancia/Hortelã por R$ 19,97',
            '- 1 Loção Hidratante Paixão Bridgerton 200 ml Dama de Prata por R$ 9,99',
            '- 1 Mucilon 360g Multicereais Sachet por R$ 9,49',
            'Total dos produtos: R$ 39,45',
            'Taxa de entrega: R$ 5,00',
            'Total geral: R$ 44,45',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '14:10',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?'],
          time: '14:10',
        },
        {
          side: 'incoming',
          lines: ['Acima de 40,00 não tem taxa certa?'],
          time: '14:11',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Exato! Como o total dos produtos é R$ 39,45, a taxa de entrega de R$ 5,00 ainda será cobrada. Se quiser adicionar mais algum item para alcançar R$ 40,00 ou mais, a entrega será grátis. Quer que eu ajude a escolher algo mais?',
          ],
          time: '14:11',
        },
        {
          side: 'incoming',
          lines: ['Tem pinça comum?'],
          time: '14:11',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Olá! No momento, temos disponível o Alicate Mundial (522) Cutícula por R$ 22,59, que é o item mais próximo da sua solicitação de pinça comum.',
            'Quer que eu inclua esse item no seu pedido?',
          ],
          time: '14:11',
        },
        {
          side: 'incoming',
          lines: ['Pode colocar sabonete infantil em barra de Huggus erva doce'],
          time: '14:12',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Sobre o sabonete infantil em barra Huggus erva doce, infelizmente não temos exatamente esse produto. A opção mais próxima é o Sabonete Francis 90g Hydratta Cereja Oriente F por R$ 3,99 ou o Sabonete Hidramais líquido 500 ml Erva Doce por R$ 14,49.',
            'Quanto à pinça comum, temos o Alicate Mundial (522) Cutícula por R$ 22,59, que é o item mais próximo para cuidados de unhas.',
            'Quer incluir algum desses itens no seu pedido?',
          ],
          time: '14:13',
        },
        {
          side: 'incoming',
          lines: ['Colocar sabonete da granado de erva doce'],
          time: '14:13',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o Sabonete Granado Erva Doce em barra 90g por R$ 6,59.',
            'Posso incluir esse sabonete no seu pedido?',
          ],
          time: '14:14',
        },
        {
          side: 'incoming',
          lines: ['Não'],
          time: '14:14',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Como posso te ajudar? Se quiser, posso buscar outros produtos para você.'],
          time: '14:14',
        },
        {
          side: 'incoming',
          lines: ['Coloca lux orquídea negra em barra'],
          time: '14:14',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei o sabonete que você pediu:',
            'Sabonete Lux 85g Botanicals Orquídea Negra por R$ 2,89.',
            'Quer que reserve para você?',
          ],
          time: '14:15',
        },
        {
          side: 'incoming',
          lines: ['Isso'],
          time: '14:15',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado 1 sabonete Lux 85g Botanicals Orquídea Negra por R$ 2,89.',
            'Resumo do pedido:',
            '- 1 Listerine 500 ml Melancia/Hortelã por R$ 19,97',
            '- 1 Loção Hidratante Paixão Bridgerton 200 ml Dama de Prata por R$ 9,99',
            '- 1 Mucilon 360g Multicereais Sachet por R$ 9,49',
            '- 1 Sabonete Lux 85g Botanicals Orquídea Negra por R$ 2,89',
            'Total dos produtos: R$ 42,34',
            'Entrega: grátis (total acima de R$ 40,00)',
            'Endereço: Rua Botafogo, lote 20, quadra 229',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '14:15',
          blurLineIndices: [8],
        },
        {
          side: 'incoming',
          lines: ['Pode acrescentar msis 1 sabonete lux'],
          time: '14:16',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado mais 1 sabonete Lux 85g Botanicals Orquídea Negra por R$ 2,89.',
            'Resumo do pedido:',
            '- 1 Listerine 500 ml Melancia/Hortelã por R$ 19,97',
            '- 1 Loção Hidratante Paixão Bridgerton 200 ml Dama de Prata por R$ 9,99',
            '- 1 Mucilon 360g Multicereais Sachet por R$ 9,49',
            '- 2 Sabonetes Lux 85g Botanicals Orquídea Negra por R$ 5,78',
            'Total dos produtos: R$ 45,23',
            'Entrega: grátis (total acima de R$ 40,00)',
            'Endereço: Rua Botafogo, lote 20, quadra 229',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '14:16',
          blurLineIndices: [8],
        },
        {
          side: 'incoming',
          lines: ['Vai ser via pix'],
          time: '14:16',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Pedido confirmado com sucesso!', 'Se precisar de mais alguma coisa, estou à disposição.'],
          time: '14:16',
          solid: true,
        },
      ],
    },
    {
      buttonLabel: 'Conversa 5',
      contactName: 'Josiane',
      messages: [
        {
          side: 'incoming',
          lines: ['Bom dia'],
          time: '07:47',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Bem-vindo à Drogaria!',
            '🚚 Receba seu pedido no conforto de casa!',
            'Entrega por apenas R$ 5,00.',
            'Qual seu nome, por favor?',
          ],
          time: '07:47',
        },
        {
          side: 'incoming',
          lines: ['Josiane'],
          time: '07:47',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Olá, Josiane! Quais produtos você precisa hoje?'],
          time: '07:47',
        },
        {
          side: 'incoming',
          lines: ['Gostaria de saber o valor de um medicamento'],
          time: '07:48',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, informe o nome completo do medicamento que você deseja consultar para que eu possa verificar o valor para você.',
          ],
          time: '07:48',
        },
        {
          side: 'incoming',
          lines: [],
          time: '07:48',
          attachment: {
            kind: 'recipe',
            title: 'Receita enviada',
            subtitle: 'Imagem enviada para consulta',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/receita-medica-conversa-5.jpg',
            imageAlt: 'Imagem da receita enviada na conversa 5',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você:',
            '- Bravan 320 mg, 30 comprimidos por R$ 51,89',
            '- Selozok 25 mg, 30 comprimidos revestidos por R$ 36,75',
            'Se quiser, posso ajudar com mais alguma coisa ou registrar seu pedido.',
          ],
          time: '07:49',
        },
        {
          side: 'incoming',
          lines: ['Muito obrigado'],
          time: '07:49',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Como posso te ajudar?'],
          time: '07:49',
        },
        {
          side: 'incoming',
          lines: ['Vou na loja'],
          time: '07:50',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Tudo bem, Josiane! Se precisar de algo no futuro, estarei aqui para ajudar. Tenha um ótimo dia!',
          ],
          time: '07:50',
        },
        {
          side: 'incoming',
          lines: ['Obrigada'],
          time: '07:51',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['De nada, Josiane! Qualquer coisa, é só chamar. Até mais!'],
          time: '07:51',
          solid: true,
        },
      ],
    },
    {
      buttonLabel: 'Conversa 6',
      contactName: 'Suiane',
      messages: [
        {
          side: 'incoming',
          lines: ['Boa noite!'],
          time: '18:53',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Bem-vindo à Drogaria!',
            '🚚 Receba seu pedido no conforto de casa!',
            'Entrega por apenas R$ 5,00.',
            'Qual seu nome, por favor?',
          ],
          time: '18:53',
        },
        {
          side: 'incoming',
          lines: ['Tem essa medição??'],
          time: '18:54',
          attachment: {
            kind: 'medicine',
            title: 'Imagem enviada',
            subtitle: 'Medicamento consultado pelo cliente',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/foto-medicamento-3-conversa-6.jpg',
            imageAlt: 'Foto do medicamento consultado na conversa 6',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Benicar HCT 20+12,5 mg, 30 comprimidos revestidos por R$ 74,97. Este produto corresponde exatamente à sua solicitação. Deseja que eu reserve para você?',
          ],
          time: '18:54',
        },
        {
          side: 'incoming',
          lines: ['Tem o genérico??'],
          time: '18:55',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Olmesartana + hidroclorotiazida 20 mg + 12,5 mg, 30 comprimidos, da Eurofarma (genérico do Benicar HCT) por R$ 28,79.',
            'É uma excelente opção genérica para o Benicar HCT que você pediu, com o mesmo princípio ativo e dosagem.',
            'Atende?',
          ],
          time: '18:55',
        },
        {
          side: 'incoming',
          lines: ['Qual valor da entrega ?'],
          time: '18:58',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['A entrega é por apenas R$ 5,00. Posso ajudar com mais alguma coisa?'],
          time: '18:58',
        },
        {
          side: 'incoming',
          lines: ['Não'],
          time: '19:00',
        },
        {
          side: 'incoming',
          lines: ['Vou querer o remédio'],
          time: '19:00',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Qual seu nome, por favor?'],
          time: '19:00',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Por favor, qual seu nome para que eu possa registrar o pedido?'],
          time: '19:00',
        },
        {
          side: 'incoming',
          lines: ['Suiane'],
          time: '19:01',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado, Suiane Alves. Por favor, informe o endereço completo para entrega, incluindo ponto de referência se possível.',
          ],
          time: '19:01',
        },
        {
          side: 'incoming',
          lines: [
            'Rua Dom Pedro II 674 Vilar dos Teles',
            'Depois do Salão de festas Laine Festas',
          ],
          time: '19:02',
          blurLineIndices: [0, 1],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Endereço anotado: Rua Dom Pedro II, 674, Vilar dos Teles, próximo ao Salão de festas Laine Festas.',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '19:02',
          blurLineIndices: [0],
        },
        {
          side: 'incoming',
          lines: ['Pix'],
          time: '19:05',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Pagamento via Pix será feito no momento da entrega, sem problemas.',
            'Resumo do pedido',
            '🛍️ Itens: 1 unidade (Olmesartana + hidroclorotiazida 20 mg + 12,5 mg, )',
            '💰Total: R$ 33,79 (R$ 28,79 do remédio + R$ 5,00 da entrega)',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua Dom Pedro II, 674, Vilar dos Teles, próximo ao Salão de festas Laine Festas',
            '💳 Pagamento: Pix no momento da entrega',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Confirma o pedido?',
          ],
          time: '19:05',
          blurLineIndices: [5],
        },
        {
          side: 'incoming',
          lines: ['Sim'],
          time: '19:07',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Pedido confirmado e registrado com sucesso, Suiane Alves. Seu remédio será entregue no endereço informado. A entrega custa R$ 5,00 e o pagamento via Pix será feito no momento da entrega. Obrigado por escolher a IA Zapfarma! Se precisar de algo mais, estou à disposição.',
          ],
          time: '19:07',
          solid: true,
        },
      ],
    },


    {
      buttonLabel: 'Conversa 7',
      contactName: 'Natália',
      messages: [
        {
          side: 'incoming',
          lines: ['Boa tarde'],
          time: '17:09',
          attachment: {
            kind: 'recipe',
            title: 'Receita enviada',
            subtitle: 'Imagem enviada pelo cliente',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/receita-medica-3-conversa-7.jpg',
            imageAlt: 'Imagem da receita enviada na conversa 7',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Allegra Suspensão 60 ml com seringa por R$ 34,89, que é a apresentação Allegra 6 mg/ml que você pediu. Também disponível Allegra Suspensão 150 ml por R$ 81,49.',
            'Temos Predsim 3 Mg/ml solução oral 60 ml por R$ 31,09, e também a apresentação de 100 ml por R$ 56,69.',
            'Temos Avamys Spray Nasal 120 doses por R$ 67,57.',
            'Quer que eu reserve algum desses para você?',
          ],
          time: '17:10',
        },
        {
          side: 'incoming',
          lines: ['Os 2 primeiros tem genérico?'],
          time: '17:11',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Fexofenadina 6 mg/ml suspensão oral 60 ml EMS por R$ 26,49, que é uma opção genérica ao Allegra com o mesmo princípio ativo e concentração. Atende?',
            'Quanto ao Predsim 3 mg/ml, temos o próprio Predsim solução 60 ml por R$ 31,09, que é o produto similar mais próximo na apresentação que você pediu. Quer que eu reserve algum?',
          ],
          time: '17:11',
        },
        {
          side: 'incoming',
          lines: ['Qual valor total? Que dá os 3?'],
          time: '17:14',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'O valor dos produtos que você pediu, considerando as apresentações menores, é:',
            '- Allegra Suspensão 60 ml: R$ 34,89',
            '- Predsim 3 mg/ml solução oral 60 ml: R$ 31,09',
            '- Avamys Spray Nasal 120 doses: R$ 67,57',
            'Total dos produtos: R$ 133,55',
            'Entrega: R$ 5,00',
            'Total geral: R$ 138,55',
            'Quer que eu reserve para você? Qual nome para o pedido?',
          ],
          time: '17:15',
        },
        {
          side: 'incoming',
          lines: ['Pode entregar pfv'],
          time: '17:49',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Qual seu nome, por favor?'],
          time: '17:50',
        },
        {
          side: 'incoming',
          lines: ['Natália'],
          time: '17:50',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, informe o endereço completo para entrega, incluindo número e ponto de referência, se possível.',
          ],
          time: '17:51',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'O valor dos produtos que você pediu, considerando as apresentações menores, é:',
            '- Allegra Suspensão 60 ml: R$ 34,89',
            '- Predsim 3 mg/ml solução oral 60 ml: R$ 31,09',
            '- Avamys Spray Nasal 120 doses: R$ 67,57',
            'Total dos produtos: R$ 133,55',
            'Entrega: R$ 5,00',
            'Total geral: R$ 138,55',
            'Quer que eu reserve para você? Qual nome para o pedido?',
          ],
          time: '17:51',
        },
        {
          side: 'incoming',
          lines: ['O alegra aqui pode colocar  o genérico pfv'],
          time: '17:51',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado, vou substituir o Allegra pelo genérico Fexofenadina 6 mg/ml suspensão oral 60 ml EMS por R$ 26,49.',
            'Por favor, informe o endereço completo para entrega, incluindo número e ponto de referência, se possível.',
          ],
          time: '17:51',
        },
        {
          side: 'incoming',
          lines: ['Rua ônix Lt 21 qd 52 subida do depósito de gás Mamedes'],
          time: '17:51',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?'],
          time: '17:52',
        },
        {
          side: 'incoming',
          lines: ['Qual total fica com a substituição pfv'],
          time: '17:52',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Com a substituição do Allegra pelo genérico Fexofenadina 6 mg/ml suspensão oral 60 ml EMS, o total dos produtos fica R$ 125,15.',
            'Com a taxa de entrega de R$ 5,00, o total geral fica R$ 130,15.',
            'Qual a forma de pagamento? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '17:52',
        },
        {
          side: 'incoming',
          lines: ['Dinheiro está exato'],
          time: '17:53',
        },
        {
          side: 'incoming',
          lines: ['130,15'],
          time: '17:53',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Precisa de troco para quanto?'],
          time: '17:53',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Resumo do pedido',
            '🛍️ Itens:',
            '- Fexofenadina 6 mg/ml suspensão oral 60 ml EMS - 1 unidade',
            '- Predsim 3 mg/ml solução oral 60 ml - 1 unidade',
            '- Avamys Spray Nasal 120 doses - 1 unidade',
            '💰 Total dos produtos: R$ 125,15',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua Ônix Lt 21 qd 52 subida do depósito de gás Mamedes',
            '💳 Pagamento: Dinheiro, troco para R$ 130,15',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Confirma o pedido para que eu possa finalizar?',
          ],
          time: '17:53',
          blurLineIndices: [7],
        },
        {
          side: 'incoming',
          lines: ['Sim'],
          time: '17:54',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Pedido confirmado e enviado com sucesso, Natália.',
            'Entrega por apenas R$ 5,00.',
            'Se precisar de mais alguma coisa, estou à disposição!',
          ],
          time: '17:54',
          solid: true,
        },
      ],
    },
    {
      buttonLabel: 'Conversa 8',
      contactName: 'Nívea',
      messages: [
        {
          side: 'incoming',
          lines: ['Tem esse remédio'],
          time: '16:21',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Por favor, informe o nome ou descrição do remédio que você deseja para que eu possa verificar a disponibilidade.',
          ],
          time: '16:21',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o genérico com maleato de dexclorfeniramina 0,4 mg/mL e betametasona 0,05 mg/mL na apresentação de 120 mL com o melhor preço:',
            'Dexclorf+beta 120 mL Prati Dona por R$ 10,19.',
            'Deseja que eu adicione ao seu pedido?',
          ],
          time: '16:21',
        },
        {
          side: 'incoming',
          lines: ['Tem esse'],
          time: '16:22',
          attachment: {
            kind: 'medicine',
            title: 'Imagem enviada',
            subtitle: 'Produto consultado pelo cliente',
            meta: 'Imagem recebida',
            badge: 'IMG',
            imageSrc: 'assets/imgs/hero-chat/foto-medicamento-4.jpg',
            imageAlt: 'Foto do medicamento consultado na conversa 8',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Temos Dexclorf+beta 120 mL da Prati Dona por R$ 10,19. É um medicamento genérico que contém maleato de dexclorfeniramina 0,4 mg/mL e betametasona 0,05 mg/mL, exatamente o que você solicitou. Posso reservar para você?',
          ],
          time: '16:22',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Encontrei para você o produto genérico com maleato de dexclorfeniramina 0,4 mg/mL e betametasona 0,05 mg/mL na apresentação de 120 mL. A melhor opção em preço é:',
            'Dexclorf+beta 120 mL Prati Dona por R$ 10,19.',
            'Este é um genérico que contém exatamente as substâncias que você pediu. Posso reservar para você?',
          ],
          time: '16:23',
        },
        {
          side: 'incoming',
          lines: ['Eu comprei aí', 'Esse', 'No domingo'],
          time: '16:23',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: ['Como posso te ajudar?'],
          time: '16:23',
        },
        {
          side: 'incoming',
          lines: ['Eu quero mas um'],
          time: '16:23',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Posso ajudar com algo relacionado ao seu pedido feito no domingo? Por favor, me informe o que você precisa.',
          ],
          time: '16:23',
        },
        {
          side: 'incoming',
          lines: ['Vcs entregam'],
          time: '16:24',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Claro! Vou anotar mais um frasco de Dexclorf+beta 120 mL Prati Dona para você.',
            'Por favor, confirme seu nome para que eu possa continuar com o pedido.',
          ],
          time: '16:24',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Sim, entregamos no conforto da sua casa. A taxa de entrega é R$ 5,00.',
            'Por favor, qual o seu nome para que eu possa continuar com o pedido?',
          ],
          time: '16:24',
        },
        {
          side: 'incoming',
          lines: ['Nívea'],
          time: '16:24',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Obrigado, Nívea. Por favor, informe o endereço completo para entrega, incluindo ponto de referência, se possível.',
          ],
          time: '16:24',
        },
        {
          side: 'incoming',
          lines: ['Rua José Henrique dos Santos n 74'],
          time: '16:24',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotado o endereço: Rua José Henrique dos Santos, nº 74. Se tiver ponto de referência, por favor, informe para facilitar a entrega.',
          ],
          time: '16:25',
          blurLineIndices: [0],
        },
        {
          side: 'incoming',
          lines: ['Próximo ao 21 batalhão'],
          time: '16:25',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Perfeito, Nívea. Endereço completo anotado: Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão.',
            'Qual a forma de pagamento que você prefere? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '16:25',
          blurLineIndices: [0],
        },
        {
          side: 'incoming',
          lines: ['Na rua da Benetti'],
          time: '16:25',
          blurLineIndices: [0],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Anotei o complemento: na rua da Benetti.',
            'Endereço completo para entrega:',
            'Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão, na rua da Benetti.',
            'Qual a forma de pagamento que você prefere? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '16:25',
          blurLineIndices: [0, 1, 2],
        },
        {
          side: 'incoming',
          lines: ['Qual valor'],
          time: '16:25',
        },
        {
          side: 'incoming',
          lines: ['Mesmo'],
          time: '16:25',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Resumo do pedido',
            '🛍️ Itens: 1 unidade (Dexclorf+beta 120 mL Prati Dona, )',
            '💰 Total: R$ 15,19 (R$ 10,19 do produto + R$ 5,00 de entrega)',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão, na rua da Benetti',
            '💳 Pagamento: A definir',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Qual a forma de pagamento que você prefere? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '16:26',
          blurLineIndices: [4],
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Sim, o valor total é R$ 15,19, incluindo o produto por R$ 10,19 e a taxa de entrega de R$ 5,00.',
            'Qual a forma de pagamento que você prefere? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '16:26',
        },
        {
          side: 'incoming',
          lines: [],
          time: '16:26',
          attachment: {
            kind: 'audio',
            title: 'Mensagem de voz',
            subtitle: 'Áudio recebido do cliente',
            duration: '0:05',
            meta: 'Toque para ouvir',
            audioSrc: 'assets/imgs/hero-chat/conversa-8-audio-1.ogg',
          },
        },
        {
          side: 'incoming',
          lines: [],
          time: '16:26',
          attachment: {
            kind: 'audio',
            title: 'Mensagem de voz',
            subtitle: 'Áudio recebido do cliente',
            duration: '0:02',
            meta: 'Toque para ouvir',
            audioSrc: 'assets/imgs/hero-chat/conversa-8-audio-2.ogg',
          },
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Pode ser que tenha ocorrido alguma diferença de preço ou promoção no domingo. Posso verificar para você se desejar.',
            'Quer que eu confira o valor do produto Dexclorf+beta 120 mL Prati Dona para hoje?',
          ],
          time: '16:26',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'O produto Dexclorf+beta 120 mL Prati Dona é o que temos disponível, que corresponde ao que você comprou no domingo. Se quiser, posso seguir com o pedido desse mesmo item.',
          ],
          time: '16:27',
        },
        {
          side: 'incoming',
          lines: ['Pode me manda'],
          time: '16:28',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Seu pedido foi enviado com sucesso, Nívea. Em breve, receberá no endereço informado. A entrega custa R$ 5,00. Obrigado pela preferência! Se precisar de mais alguma coisa, estou à disposição.',
          ],
          time: '16:28',
        },
        {
          side: 'incoming',
          lines: ['Total e'],
          time: '16:29',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Resumo do pedido',
            '🛍️ Itens: 1 unidade (Dexclorf+beta 120 mL Prati Dona, )',
            '💰 Total: R$ 15,19 (R$ 10,19 do produto + R$ 5,00 de entrega)',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão, na rua da Benetti',
            '💳 Pagamento: A definir',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Seu pedido foi enviado com sucesso, Nívea. Obrigado pela preferência!',
          ],
          time: '16:29',
          blurLineIndices: [4],
        },
        {
          side: 'incoming',
          lines: ['No pix tá no local'],
          time: '16:29',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'No momento, o pagamento via Pix deve ser feito no momento da entrega, sem problemas. Você poderá efetuar o pagamento diretamente com o entregador. Qual a forma de pagamento que prefere? Pix, cartão (débito/crédito) ou dinheiro?',
          ],
          time: '16:29',
        },
        {
          side: 'incoming',
          lines: ['Pix'],
          time: '16:30',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Ótimo, pagamento via Pix no momento da entrega.',
            'Por favor, me informe seu nome completo para finalizar o pedido.',
          ],
          time: '16:31',
        },
        {
          side: 'incoming',
          lines: ['Nivea'],
          time: '16:32',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Nívea, encontrei um endereço cadastrado: Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão, na rua da Benetti. Confirmo esse endereço para entrega?',
          ],
          time: '16:33',
          blurLineIndices: [0],
        },
        {
          side: 'incoming',
          lines: ['Sim'],
          time: '16:33',
        },
        {
          side: 'outgoing',
          sender: '-IA Zapfarma-',
          lines: [
            'Nívea, seu pedido foi confirmado com pagamento via Pix no momento da entrega.',
            'Resumo do pedido',
            '🛍️ Itens: 1 unidade (Dexclorf+beta 120 mL Prati Dona, )',
            '💰 Total: R$ 15,19 (R$ 10,19 do produto + R$ 5,00 de entrega)',
            '🚚 Taxa de entrega: R$ 5,00',
            '🏠 Endereço: Rua José Henrique dos Santos, nº 74, próximo ao 21 batalhão, na rua da Benetti',
            '💳 Pagamento: Pix no momento da entrega',
            '⚠️ Este orçamento é válido apenas para hoje.',
            'Obrigado pela preferência! Se precisar de mais alguma coisa, estou à disposição.',
          ],
          time: '16:33',
          blurLineIndices: [5],
          solid: true,
        },
      ],
    },
  ];

  private readonly hiddenConversationIndices = new Set([7, 1, 2]);

  readonly conversations: ConversationScenario[] = [
    ...this.allConversations
      .filter((_, index) => !this.hiddenConversationIndices.has(index))
      .map((conversation, index) => ({
        ...conversation,
        buttonLabel: `Conversa ${index + 1}`,
      })),
  ];

  visibleMessages: ChatMessage[] = [];
  isTypingVisible = false;
  activeConversationIndex = 0;

  ngAfterViewInit(): void {
    this.setupVisibilityObserver();
    this.startConversationPlayback();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.clearPendingAnimationFrames();
    this.visibilityObserver?.disconnect();
  }

  restartConversationDemo(): void {
    this.scrollPhoneFrameIntoView();
    this.startConversationPlayback();
  }

  selectConversation(conversationIndex: number): void {
    this.setActiveConversation(conversationIndex);
    this.startConversationPlayback();
  }

  get phoneContactName(): string {
    return this.activeConversation.contactName;
  }

  get contactStatus(): string {
    return this.isTypingVisible ? 'digitando...' : 'online agora';
  }

  getAttachmentIcon(kind: ChatAttachmentKind): string {
    switch (kind) {
      case 'recipe':
        return 'description';
      case 'medicine':
        return 'medication';
      case 'audio':
        return 'graphic_eq';
    }
  }

  getOutgoingStatus(messageIndex: number): OutgoingStatus | null {
    const message = this.visibleMessages[messageIndex];
    if (!message || message.side !== 'outgoing') {
      return null;
    }

    for (let index = messageIndex + 1; index < this.visibleMessages.length; index++) {
      if (this.visibleMessages[index].side === 'incoming') {
        return 'read';
      }
    }

    return messageIndex === this.visibleMessages.length - 1
      ? 'sent'
      : 'delivered';
  }

  getOutgoingStatusIcon(status: OutgoingStatus): string {
    if (status === 'sent') {
      return '✓';
    }

    return '✓✓';
  }

  getOutgoingStatusAria(status: OutgoingStatus): string {
    switch (status) {
      case 'sent':
        return 'Mensagem enviada';
      case 'delivered':
        return 'Mensagem recebida';
      case 'read':
        return 'Mensagem vista';
    }
  }

  handleChatScroll(): void {
    const container = this.chatContainer?.nativeElement;
    if (!container) {
      return;
    }

    if (this.programmaticScrollLock) {
      return;
    }

    this.shouldAutoScrollChat = this.isChatNearBottom(container);
  }

  handleAttachmentMediaLoad(): void {
    if (!this.shouldAutoScrollChat) {
      return;
    }

    this.scrollChatToBottom(true);
  }

  private startConversationPlayback(): void {
    if (!this.isHeroChatVisible) {
      this.shouldResumePlaybackWhenVisible = true;
      this.clearTimers();
      this.isTypingVisible = false;
      return;
    }

    this.shouldResumePlaybackWhenVisible = false;
    this.clearTimers();
    this.visibleMessages = [];
    this.isTypingVisible = false;
    this.shouldAutoScrollChat = true;
    this.cdr.detectChanges();
    this.scrollChatToTop();
    this.scheduleActiveConversationTabIntoView();
    this.scheduleNextMessage(900, 0);
  }

  private get activeConversation(): ConversationScenario {
    return this.conversations[this.activeConversationIndex];
  }

  private scrollChatToBottom(force = false): void {
    if (!this.chatContainer?.nativeElement || typeof window === 'undefined') {
      return;
    }

    const container = this.chatContainer.nativeElement;
    if (!force && !this.shouldAutoScrollChat) {
      return;
    }

    requestAnimationFrame(() => {
      this.lockProgrammaticChatScroll();
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  }

  private scrollChatToTop(): void {
    if (!this.chatContainer?.nativeElement || typeof window === 'undefined') {
      return;
    }

    this.shouldAutoScrollChat = true;
    this.lockProgrammaticChatScroll();
    this.chatContainer.nativeElement.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }

  private scrollPhoneFrameIntoView(): void {
    if (!this.phoneFrame?.nativeElement || typeof window === 'undefined') {
      return;
    }

    this.phoneFrame.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: window.innerWidth < 1024 ? 'center' : 'nearest',
      inline: 'nearest',
    });
  }

  private scheduleNextMessage(delay: number, index: number): void {
    this.playbackTimer = setTimeout(() => {
      if (index >= this.activeConversation.messages.length) {
        this.isTypingVisible = false;
        this.restartTimer = setTimeout(() => {
          this.setActiveConversation(
            (this.activeConversationIndex + 1) % this.conversations.length
          );
          this.startConversationPlayback();
        }, 2600);
        return;
      }

      const nextMessage = this.activeConversation.messages[index];
      if (nextMessage.side === 'incoming') {
        this.isTypingVisible = true;
        this.scrollChatToBottom();
        this.playbackTimer = setTimeout(
          () => {
            this.isTypingVisible = false;
            this.revealMessage(nextMessage);
            this.scheduleNextMessage(
              this.getDelayAfterMessage(nextMessage),
              index + 1
            );
          },
          index === 0 ? 1250 : 900
        );
        return;
      }

      this.revealMessage(nextMessage);
      this.scheduleNextMessage(
        this.getDelayAfterMessage(nextMessage),
        index + 1
      );
    }, delay);
  }

  private revealMessage(message: ChatMessage): void {
    this.visibleMessages = [...this.visibleMessages, message];
    this.scrollChatToBottom();
  }

  private getDelayAfterMessage(message: ChatMessage): number {
    if (message.solid) {
      return 2350;
    }

    if (message.attachment?.kind === 'audio') {
      return 2250;
    }

    if (message.attachment) {
      return 2000;
    }

    if (message.lines.length >= 5) {
      return 1900;
    }

    return message.side === 'outgoing' ? 1500 : 1200;
  }

  private clearTimers(): void {
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = undefined;
    }

    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = undefined;
    }

    if (this.programmaticScrollReleaseTimer) {
      clearTimeout(this.programmaticScrollReleaseTimer);
      this.programmaticScrollReleaseTimer = undefined;
    }

    this.programmaticScrollLock = false;
  }

  private setActiveConversation(conversationIndex: number): void {
    this.activeConversationIndex = conversationIndex;
    this.cdr.detectChanges();
    this.scheduleActiveConversationTabIntoView();
  }

  private clearPendingAnimationFrames(): void {
    if (this.tabScrollFrame !== undefined) {
      cancelAnimationFrame(this.tabScrollFrame);
      this.tabScrollFrame = undefined;
    }

    if (this.tabScrollSettleFrame !== undefined) {
      cancelAnimationFrame(this.tabScrollSettleFrame);
      this.tabScrollSettleFrame = undefined;
    }
  }

  private isChatNearBottom(container: HTMLDivElement): boolean {
    return (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 24
    );
  }

  private lockProgrammaticChatScroll(): void {
    this.programmaticScrollLock = true;

    if (this.programmaticScrollReleaseTimer) {
      clearTimeout(this.programmaticScrollReleaseTimer);
    }

    this.programmaticScrollReleaseTimer = setTimeout(() => {
      this.programmaticScrollLock = false;
      this.programmaticScrollReleaseTimer = undefined;
    }, 250);
  }

  private scheduleActiveConversationTabIntoView(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.clearPendingAnimationFrames();

    this.tabScrollFrame = requestAnimationFrame(() => {
      this.tabScrollFrame = undefined;
      this.tabScrollSettleFrame = requestAnimationFrame(() => {
        this.tabScrollSettleFrame = undefined;
        this.scrollActiveConversationTabIntoView();
      });
    });
  }

  private scrollActiveConversationTabIntoView(): void {
    if (
      !this.conversationTabButtons?.length ||
      !this.conversationTabList?.nativeElement ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const tabList = this.conversationTabList?.nativeElement;
    const activeButton =
      this.conversationTabButtons?.get(this.activeConversationIndex)
        ?.nativeElement;

    if (!tabList || !activeButton) {
      return;
    }

    const tabListRect = tabList.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const visibleStart = tabList.scrollLeft;
    const visibleTop = tabList.scrollTop;
    const maxScrollLeft = Math.max(0, tabList.scrollWidth - tabList.clientWidth);
    const maxScrollTop = Math.max(0, tabList.scrollHeight - tabList.clientHeight);
    const isHorizontallyVisible =
      buttonRect.left >= tabListRect.left && buttonRect.right <= tabListRect.right;
    const isVerticallyVisible =
      buttonRect.top >= tabListRect.top && buttonRect.bottom <= tabListRect.bottom;

    if (isHorizontallyVisible && isVerticallyVisible) {
      return;
    }

    const revealLeft = Math.max(
      0,
      Math.min(
        maxScrollLeft,
        buttonRect.left < tabListRect.left
        ? visibleStart - (tabListRect.left - buttonRect.left)
        : visibleStart + (buttonRect.right - tabListRect.right)
      )
    );
    const revealTop = Math.max(
      0,
      Math.min(
        maxScrollTop,
        buttonRect.top < tabListRect.top
        ? visibleTop - (tabListRect.top - buttonRect.top)
        : visibleTop + (buttonRect.bottom - tabListRect.bottom)
      )
    );

    tabList.scrollTo({
      left: isHorizontallyVisible ? visibleStart : revealLeft,
      top: isVerticallyVisible ? visibleTop : revealTop,
      behavior: 'smooth',
    });
  }

  private setupVisibilityObserver(): void {
    if (
      !this.phoneFrame?.nativeElement ||
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35;

        if (this.isHeroChatVisible === isVisible) {
          return;
        }

        this.isHeroChatVisible = isVisible;

        if (!isVisible) {
          this.shouldResumePlaybackWhenVisible = true;
          this.clearTimers();
          this.isTypingVisible = false;
          return;
        }

        if (this.shouldResumePlaybackWhenVisible) {
          this.startConversationPlayback();
        }
      },
      {
        threshold: [0, 0.35, 0.6],
      }
    );

    this.visibilityObserver.observe(this.phoneFrame.nativeElement);
  }
}
