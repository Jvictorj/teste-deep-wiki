import { AfterViewInit, Component, ContentChild, ElementRef, HostBinding, Input } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export type CarouselOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'app-carousel',
  standalone: true,
  template: '<div class="carousel" role="region" aria-roledescription="carousel"><ng-content></ng-content></div>',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit {
  @Input() orientation: CarouselOrientation = 'horizontal';

  @ContentChild('carouselContent', { read: ElementRef })
  content?: ElementRef<HTMLElement>;

  canScrollPrev = false;
  canScrollNext = false;

  private destroy$ = new Subject<void>();

  @HostBinding('class')
  get classes(): string {
    return `carousel-host ${this.orientation}`;
  }

  ngAfterViewInit(): void {
    if (!this.content) return;

    const element = this.content.nativeElement;
    const onUpdate = () => this.updateButtons(element);

    merge(fromEvent(element, 'scroll'), fromEvent(window, 'resize'))
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe(onUpdate);

    onUpdate();
  }

  scrollPrev(): void {
    if (!this.content) return;
    this.scrollBy(-1);
  }

  scrollNext(): void {
    if (!this.content) return;
    this.scrollBy(1);
  }

  private scrollBy(direction: number): void {
    if (!this.content) return;
    const element = this.content.nativeElement;
    const amount = this.orientation === 'horizontal' ? element.clientWidth : element.clientHeight;
    if (this.orientation === 'horizontal') {
      element.scrollBy({ left: amount * direction, behavior: 'smooth' });
    } else {
      element.scrollBy({ top: amount * direction, behavior: 'smooth' });
    }
  }

  private updateButtons(element: HTMLElement): void {
    if (this.orientation === 'horizontal') {
      this.canScrollPrev = element.scrollLeft > 0;
      this.canScrollNext = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
      return;
    }

    this.canScrollPrev = element.scrollTop > 0;
    this.canScrollNext = element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }
}
