import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  openDialog(): void {
    this.open = true;
    this.openChange.emit(true);
  }

  closeDialog(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
