import { Directive, HostListener } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog.component';

@Directive({
  selector: '[alertDialogAction]',
  standalone: true,
})
export class AlertDialogActionDirective {
  constructor(private dialog: AlertDialogComponent) {}

  @HostListener('click')
  onClick(): void {
    this.dialog.closeDialog();
  }
}
