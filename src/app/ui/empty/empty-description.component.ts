import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-description',
  standalone: true,
  template: '<div class="empty-description"><ng-content></ng-content></div>',
  styleUrl: './empty-description.component.scss',
})
export class EmptyDescriptionComponent {}
