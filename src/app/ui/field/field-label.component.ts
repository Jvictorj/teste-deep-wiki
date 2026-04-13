import { Component } from '@angular/core';

@Component({
  selector: 'app-field-label',
  standalone: true,
  template: '<label class="field-label"><ng-content></ng-content></label>',
  styleUrl: './field-label.component.scss',
})
export class FieldLabelComponent {}
