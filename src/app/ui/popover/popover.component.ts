import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popover',
  standalone: true,
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
