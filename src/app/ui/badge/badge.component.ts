import { Component, HostBinding, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';

  @HostBinding('class')
  get classes(): string {
    return `badge badge-${this.variant}`;
  }
}
