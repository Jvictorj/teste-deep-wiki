import { Directive, HostListener } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';

@Directive({
  selector: '[contextMenuTrigger]',
  standalone: true,
})
export class ContextMenuTriggerDirective {
  constructor(private menu: ContextMenuComponent) {}

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    this.menu.openAt(event);
  }
}
