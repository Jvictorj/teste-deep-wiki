import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  open = false;

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }
}
