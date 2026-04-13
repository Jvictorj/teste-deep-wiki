import { Component, Input } from '@angular/core';

export type EmptyMediaVariant = 'default' | 'icon';

@Component({
  selector: 'app-empty',
  standalone: true,
  template: '<div class="empty"><ng-content></ng-content></div>',
  styleUrl: './empty.component.scss',
})
export class EmptyComponent {}
