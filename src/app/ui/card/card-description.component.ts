import { Component } from '@angular/core';

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: '<div class="card-description"><ng-content></ng-content></div>',
  styleUrl: './card-description.component.scss',
})
export class CardDescriptionComponent {}
