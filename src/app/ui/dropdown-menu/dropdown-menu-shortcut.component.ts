import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu-shortcut',
  standalone: true,
  template: '<span class="dropdown-shortcut"><ng-content></ng-content></span>',
  styleUrl: './dropdown-menu-shortcut.component.scss',
})
export class DropdownMenuShortcutComponent {}
