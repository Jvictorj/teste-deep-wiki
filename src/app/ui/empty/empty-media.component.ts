import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-empty-media',
  standalone: true,
  template: '<div class="empty-media"><ng-content></ng-content></div>',
  styleUrl: './empty-media.component.scss',
})
export class EmptyMediaComponent {
  @Input() variant: EmptyMediaVariant = 'default';

  @HostBinding('class')
  get classes(): string {
    return `empty-media ${this.variant}`;
  }
}
