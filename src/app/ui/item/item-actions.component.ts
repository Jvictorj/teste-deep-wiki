import { Component } from '@angular/core';

@Component({
  selector: 'app-item-actions',
  standalone: true,
  template: '<div class="item-actions"><ng-content></ng-content></div>',
  styleUrl: './item-actions.component.scss',
})
export class ItemActionsComponent {}
