import { Directive, HostListener } from '@angular/core';
import { DialogComponent } from './dialog.component';

@Directive({
  selector: '[dialogTrigger]',
  standalone: true,
})
export class DialogTriggerDirective {
  constructor(private dialog: DialogComponent) {}

  @HostListener('click')
  onClick(): void {
    this.dialog.open = true;
    this.dialog.openChange.emit(true);
  }
}
