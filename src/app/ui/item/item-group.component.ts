import { Component } from '@angular/core';

@Component({
  selector: 'app-item-group',
  standalone: true,
  template: '<div class="item-group"><ng-content></ng-content></div>',
  styleUrl: './item-group.component.scss',
})
export class ItemGroupComponent {}
