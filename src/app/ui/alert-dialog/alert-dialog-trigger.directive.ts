import { Directive, HostListener } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog.component';

@Directive({
  selector: '[alertDialogTrigger]',
  standalone: true,
})
export class AlertDialogTriggerDirective {
  constructor(private dialog: AlertDialogComponent) {}

  @HostListener('click')
  onClick(): void {
    this.dialog.openDialog();
  }
}
