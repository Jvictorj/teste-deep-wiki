import { Component } from '@angular/core';

@Component({
  selector: 'app-context-menu-label',
  standalone: true,
  template: '<div class="context-label"><ng-content></ng-content></div>',
  styleUrl: './context-menu-label.component.scss',
})
export class ContextMenuLabelComponent {}
