import { Directive, HostListener } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Directive({
  selector: '[sheetTrigger]',
  standalone: true,
})
export class SheetTriggerDirective {
  constructor(private sheet: SheetComponent) {}

  @HostListener('click')
  onClick(): void {
    this.sheet.open = true;
    this.sheet.openChange.emit(true);
  }
}
