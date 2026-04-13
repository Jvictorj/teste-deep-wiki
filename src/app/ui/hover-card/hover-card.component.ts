import { Component } from '@angular/core';

@Component({
  selector: 'app-hover-card',
  standalone: true,
  templateUrl: './hover-card.component.html',
  styleUrl: './hover-card.component.scss',
})
export class HoverCardComponent {
  open = false;
  show(): void {
    this.open = true;
  }
  hide(): void {
    this.open = false;
  }
}
