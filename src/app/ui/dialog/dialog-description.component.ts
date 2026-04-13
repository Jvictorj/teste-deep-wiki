import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-description',
  standalone: true,
  template: '<p class="dialog-description"><ng-content></ng-content></p>',
  styleUrl: './dialog-description.component.scss',
})
export class DialogDescriptionComponent {}
