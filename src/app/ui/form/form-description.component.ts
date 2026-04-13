import { Component } from '@angular/core';

@Component({
  selector: 'app-form-description',
  standalone: true,
  template: '<p class="form-description"><ng-content></ng-content></p>',
  styleUrl: './form-description.component.scss',
})
export class FormDescriptionComponent {}
