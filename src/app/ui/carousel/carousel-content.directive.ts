import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[carouselContent]',
  standalone: true,
})
export class CarouselContentDirective {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @HostBinding('class')
  get classes(): string {
    return `carousel-content ${this.orientation}`;
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {
    this.elementRef.nativeElement.setAttribute('data-slot', 'carousel-content');
  }
}
