import { Component } from '@angular/core';

@Component({
  selector: 'app-command-shortcut',
  standalone: true,
  template: '<span class="command-shortcut"><ng-content></ng-content></span>',
  styleUrl: './command-shortcut.component.scss',
})
export class CommandShortcutComponent {}
