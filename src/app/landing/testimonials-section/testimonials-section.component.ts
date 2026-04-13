import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type Testimonial = {
  name: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  growth: string;
  period: string;
  quote: string;
  author: string;
  role: string;
};

@Component({
  selector: 'front-zapfarma-testimonials-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {
  testimonials: Testimonial[] = [
    {
      name: 'Drogaria Pense Bem',
      logoSrc: 'assets/imgs/logo-testimonial/Drogaria Pense Bem-2.png',
      logoAlt: 'Logo da Drogaria Pense Bem',
      logoWidth: 225,
      logoHeight: 225,
      growth: '',
      period: '',
      quote:
        'Com a ZapFarma, temos um atendimento muito mais ágil e organizado nos horários de pico da nossa drogaria. A ZapFarma nos proporcionou desde o momento da implantação até os dias atuais todo o suporte necessário. Os profissionais são super competentes e muito dedicados com o trabalho e serviço que oferecem. Reduzimos de 6 para 2 colaboradores no atendimento, a conversão disparou e a equipe ficou muito mais leve. Venda finalizada. Isso sim que é resultado! Parabéns ZapFarma, estamos muito satisfeitos!',
      author: 'Thiago Castro',
      role: 'Gerente Drogaria Pense Bem',
    },
    {
      name: 'Drogaria SaudeMed',
      logoSrc: 'assets/imgs/logo-testimonial/SaudeMed.jpeg',
      logoAlt: 'Logo da Drogaria SaudeMed',
      logoWidth: 1000,
      logoHeight: 1000,
      growth: '',
      period: '',
      quote:
        'Boa tarde, falando sobre o ZapFarma: já tem uns três meses que instalei e melhorou no meu dia. O registro do meu número na API oficial, padronização do meu atendimento, agilidade, comunicação com os clientes, controle dos funcionários e mensagens, ver a deficiência para conseguir ajustar, entre outros. Estou gostando. Tmj.',
      author: 'Rômulo Barcaro',
      role: 'Proprietário',
    },
   {
      name: 'Drogaria Mais Barato',
      logoSrc: 'assets/imgs/logo-testimonial/mais-barato-icon.png',
      logoAlt: 'Logo da Drogaria Mais Barato',
      logoWidth: 100,
      logoHeight: 100,
      growth: '',
      period: '',
      quote:
        'Depois que implementamos a IA da Zapfarma na Drogaria Mais Barato, tivemos uma mudança real no nosso faturamento. A automação agilizou o atendimento, aumentou o número de pedidos pelo WhatsApp e não perdemos mais vendas fora do horário comercial. A IA responde rápido, negocia e finaliza pedidos com eficiência. Em pouco tempo, percebemos um crescimento consistente nas vendas e mais organização na operação. Foi uma decisão que impactou diretamente nosso resultado.',
      author: 'Michele Oliveira',
      role: 'Proprietária',
    },
  ];

  currentIndex = 0;
  cardsPerView = 1;
  readonly quoteClampLength = 220;
  expandedTestimonials = new Set<number>();
  private autoAdvanceId: ReturnType<typeof setInterval> | null = null;
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;
  private touchDeltaX = 0;
  private touchDeltaY = 0;

  ngAfterViewInit(): void {
    this.updateCardsPerView();
    this.startAutoAdvance();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardsPerView();
    this.restartAutoAdvance();
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.maxIndex;
  }

  get maxIndex(): number {
    return Math.max(0, this.testimonials.length - this.cardsPerView);
  }

  prev(): void {
    if (!this.canGoPrev) return;
    this.currentIndex -= 1;
    this.restartAutoAdvance();
  }

  next(): void {
    if (!this.canGoNext) return;
    this.currentIndex += 1;
    this.restartAutoAdvance();
  }

  onTouchStart(event: TouchEvent): void {
    if (this.cardsPerView > 1 || event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchDeltaX = 0;
    this.touchDeltaY = 0;
    this.stopAutoAdvance();
  }

  onTouchMove(event: TouchEvent): void {
    if (this.cardsPerView > 1 || this.touchStartX === null || this.touchStartY === null) {
      return;
    }

    const touch = event.touches[0];
    this.touchDeltaX = touch.clientX - this.touchStartX;
    this.touchDeltaY = touch.clientY - this.touchStartY;

    if (Math.abs(this.touchDeltaX) > Math.abs(this.touchDeltaY) + 8) {
      event.preventDefault();
    }
  }

  onTouchEnd(): void {
    if (this.cardsPerView > 1 || this.touchStartX === null || this.touchStartY === null) {
      this.resetTouchState();
      this.restartAutoAdvance();
      return;
    }

    const horizontalThreshold = 48;
    const isHorizontalSwipe = Math.abs(this.touchDeltaX) > Math.abs(this.touchDeltaY) + 12;

    if (isHorizontalSwipe && Math.abs(this.touchDeltaX) >= horizontalThreshold) {
      if (this.touchDeltaX < 0 && this.canGoNext) {
        this.currentIndex += 1;
      } else if (this.touchDeltaX > 0 && this.canGoPrev) {
        this.currentIndex -= 1;
      }
    }

    this.resetTouchState();
    this.restartAutoAdvance();
  }

  toggleExpanded(index: number): void {
    if (this.expandedTestimonials.has(index)) {
      this.expandedTestimonials.delete(index);
      return;
    }

    this.expandedTestimonials.add(index);
  }

  isExpanded(index: number): boolean {
    return this.expandedTestimonials.has(index);
  }

  isLongQuote(quote: string): boolean {
    return quote.trim().length > this.quoteClampLength;
  }

  getTrackTransform(): string {
    const slideWidth = 100 / this.cardsPerView;
    return `translateX(-${this.currentIndex * slideWidth}%)`;
  }

  private updateCardsPerView(): void {
    this.cardsPerView = window.innerWidth >= 1024 ? 2 : 1;
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
  }

  private startAutoAdvance(): void {
    if (this.autoAdvanceId) {
      return;
    }
    this.autoAdvanceId = setInterval(() => {
      if (this.maxIndex === 0) {
        return;
      }
      this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
    }, 10000);
  }

  private stopAutoAdvance(): void {
    if (!this.autoAdvanceId) {
      return;
    }
    clearInterval(this.autoAdvanceId);
    this.autoAdvanceId = null;
  }

  private restartAutoAdvance(): void {
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  private resetTouchState(): void {
    this.touchStartX = null;
    this.touchStartY = null;
    this.touchDeltaX = 0;
    this.touchDeltaY = 0;
  }
}
