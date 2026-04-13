import { Component } from '@angular/core';

@Component({
  selector: 'app-form-label',
  standalone: true,
  template: '<label class="form-label"><ng-content></ng-content></label>',
  styleUrl: './form-label.component.scss',
})
export class FormLabelComponent {}
