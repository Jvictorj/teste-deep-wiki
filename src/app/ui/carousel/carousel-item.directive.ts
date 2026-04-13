import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[carouselItem]',
  standalone: true,
})
export class CarouselItemDirective {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @HostBinding('class')
  get classes(): string {
    return `carousel-item ${this.orientation}`;
  }
}
