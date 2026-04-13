import { Component, HostBinding, Input } from '@angular/core';
import { CarouselComponent } from './carousel.component';

@Component({
  selector: 'app-carousel-previous',
  standalone: true,
  template: '<button class="carousel-button" type="button" [disabled]="!carousel.canScrollPrev" (click)="carousel.scrollPrev()"><ng-content></ng-content></button>',
  styleUrl: './carousel-controls.component.scss',
})
export class CarouselPreviousComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  constructor(public carousel: CarouselComponent) {}

  @HostBinding('class')
  get classes(): string {
    return `carousel-control prev ${this.orientation}`;
  }
}
