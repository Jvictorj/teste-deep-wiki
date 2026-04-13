import { Component } from '@angular/core';

@Component({
  selector: 'app-item-title',
  standalone: true,
  template: '<div class="item-title"><ng-content></ng-content></div>',
  styleUrl: './item-title.component.scss',
})
export class ItemTitleComponent {}
