import { Component, HostBinding, Input } from '@angular/core';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() renderAs: 'button' | 'a' = 'button';
  @Input() href?: string;
  @Input() target?: string;
  @Input() rel?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  @HostBinding('class')
  get classes(): string {
    return `btn ${this.variant} ${this.size}`;
  }
}
