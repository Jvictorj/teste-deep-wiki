import { Component, HostBinding, Input } from '@angular/core';

export type ItemVariant = 'default' | 'outline' | 'muted';
export type ItemSize = 'default' | 'sm';

@Component({
  selector: 'app-item',
  standalone: true,
  template: '<div class="item"><ng-content></ng-content></div>',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() variant: ItemVariant = 'default';
  @Input() size: ItemSize = 'default';

  @HostBinding('class')
  get classes(): string {
    return `item ${this.variant} ${this.size}`;
  }
}
