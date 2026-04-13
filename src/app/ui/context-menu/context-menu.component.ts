import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  x = 0;
  y = 0;

  openAt(event: MouseEvent): void {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY;
    this.open = true;
    this.openChange.emit(true);
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
