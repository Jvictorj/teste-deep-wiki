import { Component } from '@angular/core';

@Component({
  selector: 'app-context-menu-shortcut',
  standalone: true,
  template: '<span class="context-shortcut"><ng-content></ng-content></span>',
  styleUrl: './context-menu-shortcut.component.scss',
})
export class ContextMenuShortcutComponent {}
