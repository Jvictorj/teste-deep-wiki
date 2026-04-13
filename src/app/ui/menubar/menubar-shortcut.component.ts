import { Component } from '@angular/core';

@Component({
  selector: 'app-menubar-shortcut',
  standalone: true,
  template: '<span class="menubar-shortcut"><ng-content></ng-content></span>',
  styleUrl: './menubar-shortcut.component.scss',
})
export class MenubarShortcutComponent {}
