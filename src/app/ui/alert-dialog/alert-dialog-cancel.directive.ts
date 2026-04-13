import { Directive, HostListener } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog.component';

@Directive({
  selector: '[alertDialogCancel]',
  standalone: true,
})
export class AlertDialogCancelDirective {
  constructor(private dialog: AlertDialogComponent) {}

  @HostListener('click')
  onClick(): void {
    this.dialog.closeDialog();
  }
}
