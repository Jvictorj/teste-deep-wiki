import { Directive, HostListener } from '@angular/core';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
  selector: '[dropdownMenuTrigger]',
  standalone: true,
})
export class DropdownMenuTriggerDirective {
  constructor(private menu: DropdownMenuComponent) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.menu.openAt(event);
  }
}
