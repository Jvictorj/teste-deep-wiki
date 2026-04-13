import { Component } from '@angular/core';

@Component({
  selector: 'app-fieldset',
  standalone: true,
  template: '<fieldset class="field-set"><ng-content></ng-content></fieldset>',
  styleUrl: './field-set.component.scss',
})
export class FieldSetComponent {}
