import { Component, HostBinding, Input } from '@angular/core';

export type ToggleVariant = 'default' | 'outline';
export type ToggleSize = 'default' | 'sm' | 'lg';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: '<button class="toggle"><ng-content></ng-content></button>',
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent {
  @Input() variant: ToggleVariant = 'default';
  @Input() size: ToggleSize = 'default';

  @HostBinding('class')
  get classes(): string {
    return `toggle ${this.variant} ${this.size}`;
  }
}
