import { Component } from '@angular/core';

@Component({
  selector: 'app-context-menu-content',
  standalone: true,
  template: '<div class="context-content"><ng-content></ng-content></div>',
  styleUrl: './context-menu-content.component.scss',
})
export class ContextMenuContentComponent {}
