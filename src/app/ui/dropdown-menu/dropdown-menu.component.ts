import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
})
export class DropdownMenuComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() x = 0;
  @Input() y = 0;
  @Input() sideOffset = 4;

  openAt(event: MouseEvent): void {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY + this.sideOffset;
    this.open = true;
    this.openChange.emit(true);
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
