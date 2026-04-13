import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu-item',
  standalone: true,
  template: '<div class="context-item" [class.destructive]="variant === \'destructive\'"><ng-content></ng-content></div>',
  styleUrl: './context-menu-item.component.scss',
})
export class ContextMenuItemComponent {
  @Input() variant: 'default' | 'destructive' = 'default';
}
