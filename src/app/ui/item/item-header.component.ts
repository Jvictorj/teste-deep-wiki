import { Component } from '@angular/core';

@Component({
  selector: 'app-item-header',
  standalone: true,
  template: '<div class="item-header"><ng-content></ng-content></div>',
  styleUrl: './item-header.component.scss',
})
export class ItemHeaderComponent {}
