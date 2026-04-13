import { Component, HostBinding, Input } from '@angular/core';

export type ItemMediaVariant = 'default' | 'icon' | 'image';

@Component({
  selector: 'app-item-media',
  standalone: true,
  template: '<div class="item-media"><ng-content></ng-content></div>',
  styleUrl: './item-media.component.scss',
})
export class ItemMediaComponent {
  @Input() variant: ItemMediaVariant = 'default';

  @HostBinding('class')
  get classes(): string {
    return `item-media ${this.variant}`;
  }
}
