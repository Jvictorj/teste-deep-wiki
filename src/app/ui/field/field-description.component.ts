import { Component } from '@angular/core';

@Component({
  selector: 'app-field-description',
  standalone: true,
  template: '<p class="field-description"><ng-content></ng-content></p>',
  styleUrl: './field-description.component.scss',
})
export class FieldDescriptionComponent {}
