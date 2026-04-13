import { Directive, HostListener } from '@angular/core';
import { DrawerComponent } from './drawer.component';

@Directive({
  selector: '[drawerTrigger]',
  standalone: true,
})
export class DrawerTriggerDirective {
  constructor(private drawer: DrawerComponent) {}

  @HostListener('click')
  onClick(): void {
    this.drawer.open = true;
    this.drawer.openChange.emit(true);
  }
}
