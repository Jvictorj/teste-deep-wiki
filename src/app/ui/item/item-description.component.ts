import { Component } from '@angular/core';

@Component({
  selector: 'app-item-description',
  standalone: true,
  template: '<div class="item-description"><ng-content></ng-content></div>',
  styleUrl: './item-description.component.scss',
})
export class ItemDescriptionComponent {}
