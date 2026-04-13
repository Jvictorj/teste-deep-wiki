import { Directive, HostListener } from '@angular/core';
import { PopoverComponent } from './popover.component';

@Directive({
  selector: '[popoverTrigger]',
  standalone: true,
})
export class PopoverTriggerDirective {
  constructor(private popover: PopoverComponent) {}

  @HostListener('click')
  onClick(): void {
    this.popover.toggle();
  }
}
