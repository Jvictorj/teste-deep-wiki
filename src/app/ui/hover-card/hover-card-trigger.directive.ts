import { Directive, HostListener } from '@angular/core';
import { HoverCardComponent } from './hover-card.component';

@Directive({
  selector: '[hoverCardTrigger]',
  standalone: true,
})
export class HoverCardTriggerDirective {
  constructor(private hoverCard: HoverCardComponent) {}

  @HostListener('mouseenter')
  onEnter(): void {
    this.hoverCard.show();
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.hoverCard.hide();
  }
}
