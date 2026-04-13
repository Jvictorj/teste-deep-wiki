import { Component, HostBinding, Input } from '@angular/core';

export type AlertVariant = 'default' | 'destructive';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: '<div class="alert"><ng-content></ng-content></div>',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'default';

  @HostBinding('class.destructive')
  get destructive(): boolean {
    return this.variant === 'destructive';
  }
}
