import { Component } from '@angular/core';

@Component({
  selector: 'app-form-message',
  standalone: true,
  template: '<p class="form-message"><ng-content></ng-content></p>',
  styleUrl: './form-message.component.scss',
})
export class FormMessageComponent {}
