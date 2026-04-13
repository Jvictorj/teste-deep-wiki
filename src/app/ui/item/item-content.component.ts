import { Component } from '@angular/core';

@Component({
  selector: 'app-item-content',
  standalone: true,
  template: '<div class="item-content"><ng-content></ng-content></div>',
  styleUrl: './item-content.component.scss',
})
export class ItemContentComponent {}
