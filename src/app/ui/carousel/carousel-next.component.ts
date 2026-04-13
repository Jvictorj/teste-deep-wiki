import { Component, HostBinding, Input } from '@angular/core';
import { CarouselComponent } from './carousel.component';

@Component({
  selector: 'app-carousel-next',
  standalone: true,
  template: '<button class="carousel-button" type="button" [disabled]="!carousel.canScrollNext" (click)="carousel.scrollNext()"><ng-content></ng-content></button>',
  styleUrl: './carousel-controls.component.scss',
})
export class CarouselNextComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  constructor(public carousel: CarouselComponent) {}

  @HostBinding('class')
  get classes(): string {
    return `carousel-control next ${this.orientation}`;
  }
}
