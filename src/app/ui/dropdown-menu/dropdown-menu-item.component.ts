import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu-item',
  standalone: true,
  template: '<div class="dropdown-item" [class.destructive]="variant === \'destructive\'"><ng-content></ng-content></div>',
  styleUrl: './dropdown-menu-item.component.scss',
})
export class DropdownMenuItemComponent {
  @Input() variant: 'default' | 'destructive' = 'default';
}
