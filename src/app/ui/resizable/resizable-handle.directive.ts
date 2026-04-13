import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[resizableHandle]',
  standalone: true,
})
export class ResizableHandleDirective {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  private startPos = 0;
  private startPrev = 0;
  private startNext = 0;
  private prev?: HTMLElement;
  private next?: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;

    this.prev = this.el.nativeElement.previousElementSibling as HTMLElement;
    this.next = this.el.nativeElement.nextElementSibling as HTMLElement;
    if (!this.prev || !this.next) return;

    this.startPos = this.orientation === 'horizontal' ? event.clientX : event.clientY;
    this.startPrev = this.orientation === 'horizontal' ? this.prev.offsetWidth : this.prev.offsetHeight;
    this.startNext = this.orientation === 'horizontal' ? this.next.offsetWidth : this.next.offsetHeight;

    const onMove = (moveEvent: MouseEvent) => {
      const current = this.orientation === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = current - this.startPos;
      const prevSize = this.startPrev + delta;
      const nextSize = this.startNext - delta;
      if (prevSize < 100 || nextSize < 100) return;
      this.prev!.style.flex = `0 0 ${prevSize}px`;
      this.next!.style.flex = `0 0 ${nextSize}px`;
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
}
