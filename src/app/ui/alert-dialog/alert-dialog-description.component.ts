import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-dialog-description',
  standalone: true,
  template: '<p class="alert-description"><ng-content></ng-content></p>',
  styleUrl: './alert-dialog-description.component.scss',
})
export class AlertDialogDescriptionComponent {}
