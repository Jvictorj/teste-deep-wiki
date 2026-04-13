import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() open = false;
  @Input() showCloseButton = true;
  @Output() openChange = new EventEmitter<boolean>();

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}


