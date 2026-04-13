import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-description',
  standalone: true,
  template: '<div class="alert-description"><ng-content></ng-content></div>',
  styleUrl: './alert-description.component.scss',
})
export class AlertDescriptionComponent {}
