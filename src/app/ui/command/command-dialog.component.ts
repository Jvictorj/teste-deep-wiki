import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-command-dialog',
  standalone: true,
  templateUrl: './command-dialog.component.html',
  styleUrl: './command-dialog.component.scss',
})
export class CommandDialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() title = 'Command Palette';
  @Input() description = 'Search for a command to run...';
  @Input() showCloseButton = true;

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
