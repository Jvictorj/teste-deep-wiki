import { Component } from '@angular/core';

@Component({
  selector: 'app-field-title',
  standalone: true,
  template: '<div class="field-title"><ng-content></ng-content></div>',
  styleUrl: './field-title.component.scss',
})
export class FieldTitleComponent {}
