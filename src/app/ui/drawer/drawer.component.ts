import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  @Input() open = false;
  @Input() side: DrawerSide = 'right';
  @Output() openChange = new EventEmitter<boolean>();

  @HostBinding('class')
  get classes(): string {
    return `drawer-host ${this.side}`;
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
