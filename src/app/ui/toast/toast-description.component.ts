import { Component } from '@angular/core';

@Component({
  selector: 'app-toast-description',
  standalone: true,
  template: '<div class="toast-description"><ng-content></ng-content></div>',
  styleUrl: './toast-description.component.scss',
})
export class ToastDescriptionComponent {}
